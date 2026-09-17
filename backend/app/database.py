import pymysql
import pymysql.cursors
import logging
from contextlib import contextmanager
from typing import Generator
from app.config import settings

logger = logging.getLogger("climate_backend.database")

def get_mysql_connection():
    """Create and return a direct MySQL connection using PyMySQL."""
    return pymysql.connect(
        host=settings.DB_HOST,
        port=settings.DB_PORT,
        user=settings.DB_USER,
        password=settings.DB_PASSWORD,
        database=settings.DB_NAME,
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor,
        autocommit=False
    )

@contextmanager
def get_db_cursor() -> Generator[pymysql.cursors.DictCursor, None, None]:
    """Context manager providing a transactional MySQL dictionary cursor."""
    conn = get_mysql_connection()
    try:
        with conn.cursor() as cursor:
            yield cursor
        conn.commit()
    except Exception as e:
        conn.rollback()
        logger.error(f"MySQL Transaction rollback due to error: {e}")
        raise e
    finally:
        conn.close()

def check_mysql_health():
    """Verify MySQL connectivity and return server information."""
    try:
        conn = get_mysql_connection()
        with conn.cursor() as cursor:
            cursor.execute("SELECT VERSION() as version, DATABASE() as db;")
            result = cursor.fetchone()
            
            cursor.execute("SELECT COUNT(*) as c FROM users;")
            users_c = cursor.fetchone()["c"]
            
            cursor.execute("SELECT COUNT(*) as c FROM submissions;")
            submissions_c = cursor.fetchone()["c"]
            
            cursor.execute("SELECT COUNT(*) as c FROM communities;")
            comms_c = cursor.fetchone()["c"]
            
            cursor.execute("SELECT COUNT(*) as c FROM environmental_reports;")
            reports_c = cursor.fetchone()["c"]
            
            conn.close()
            return {
                "connected": True,
                "database": result["db"] or settings.DB_NAME,
                "version": f"{result['version']} (InnoDB)",
                "host": f"{settings.DB_HOST}:{settings.DB_PORT}",
                "counts": {
                    "users": users_c,
                    "submissions": submissions_c,
                    "communities": comms_c,
                    "reports": reports_c
                },
                "status": "online"
            }
    except Exception as ex:
        logger.error(f"MySQL connection health check failed: {ex}")
        return {
            "connected": False,
            "database": settings.DB_NAME,
            "host": f"{settings.DB_HOST}:{settings.DB_PORT}",
            "status": "offline",
            "error": str(ex)
        }

def ensure_tables_exist():
    """Ensure all required tables and indexes exist in the MySQL database."""
    create_statements = [
        """
        CREATE TABLE IF NOT EXISTS users (
            id VARCHAR(64) PRIMARY KEY,
            name VARCHAR(128) NOT NULL,
            email VARCHAR(128) NOT NULL UNIQUE,
            password_hash VARCHAR(256) NULL,
            phone VARCHAR(32) NULL,
            country_code VARCHAR(8) DEFAULT '+91',
            community_id VARCHAR(64) NULL,
            community_name VARCHAR(128) NULL,
            district VARCHAR(64) DEFAULT 'Coimbatore',
            joined_date VARCHAR(32) NULL,
            avatar VARCHAR(512) NULL,
            `rank` INT DEFAULT 1,
            total_kg_co2e_avoided FLOAT DEFAULT 0.0,
            total_verified_actions INT DEFAULT 0,
            total_trees_planted INT DEFAULT 0,
            total_liters_water_saved FLOAT DEFAULT 0.0,
            total_kg_waste_reduced FLOAT DEFAULT 0.0,
            active_challenges_count INT DEFAULT 0,
            weekly_goal_progress INT DEFAULT 0,
            monthly_goal_progress INT DEFAULT 0,
            biggest_impact_area VARCHAR(64) DEFAULT 'Transport',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """,
        """
        CREATE TABLE IF NOT EXISTS communities (
            id VARCHAR(64) PRIMARY KEY,
            name VARCHAR(128) NOT NULL,
            district VARCHAR(64) NOT NULL,
            state VARCHAR(64) DEFAULT 'Tamil Nadu',
            description TEXT NOT NULL,
            members_count INT DEFAULT 1,
            total_kg_co2e_avoided FLOAT DEFAULT 0.0,
            total_verified_actions INT DEFAULT 0,
            total_trees_planted INT DEFAULT 0,
            total_kg_waste_reduced FLOAT DEFAULT 0.0,
            total_liters_water_saved FLOAT DEFAULT 0.0,
            environmental_score INT DEFAULT 80,
            community_action_score INT DEFAULT 85,
            trend VARCHAR(32) DEFAULT 'improving',
            top_category VARCHAR(64) DEFAULT 'Afforestation',
            weakest_category VARCHAR(64) DEFAULT 'Transport',
            joined_date VARCHAR(32) NULL,
            active_challenges_json TEXT NULL,
            avatar_color VARCHAR(32) DEFAULT 'emerald'
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """,
        """
        CREATE TABLE IF NOT EXISTS challenges (
            id VARCHAR(64) PRIMARY KEY,
            title VARCHAR(128) NOT NULL,
            category VARCHAR(64) NOT NULL,
            objective TEXT NOT NULL,
            duration_days INT DEFAULT 7,
            deadline VARCHAR(32) NOT NULL,
            participants_count INT DEFAULT 0,
            target_value FLOAT NOT NULL,
            current_value FLOAT DEFAULT 0.0,
            unit VARCHAR(32) NOT NULL,
            impact_estimate_kg_co2e FLOAT NOT NULL,
            reward_badge VARCHAR(128) NOT NULL,
            reward_icon VARCHAR(64) NOT NULL,
            ai_recommendation_reason TEXT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """,
        """
        CREATE TABLE IF NOT EXISTS submissions (
            id VARCHAR(64) PRIMARY KEY,
            user_id VARCHAR(64) NOT NULL,
            user_name VARCHAR(128) NOT NULL,
            action_id VARCHAR(64) NOT NULL,
            action_title VARCHAR(128) NOT NULL,
            category_id VARCHAR(64) NOT NULL,
            timestamp VARCHAR(64) NOT NULL,
            date VARCHAR(32) NOT NULL,
            quantity FLOAT NOT NULL,
            unit VARCHAR(32) NOT NULL,
            location VARCHAR(256) NOT NULL,
            district VARCHAR(64) NOT NULL,
            description TEXT NOT NULL,
            photo_url VARCHAR(512) NULL,
            verification_status VARCHAR(32) DEFAULT 'verified',
            ai_confidence_score INT DEFAULT 95,
            ai_analysis_reasoning TEXT NOT NULL,
            anomaly_flags_json TEXT NULL,
            calculated_kg_co2e FLOAT NOT NULL,
            secondary_impact_label VARCHAR(64) NULL,
            secondary_impact_value FLOAT NULL,
            secondary_impact_unit VARCHAR(32) NULL,
            factor_reference VARCHAR(256) NOT NULL,
            is_contributed_to_community TINYINT(1) DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_user (user_id),
            INDEX idx_cat (category_id),
            INDEX idx_date (date)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """,
        """
        CREATE TABLE IF NOT EXISTS environmental_reports (
            id VARCHAR(64) PRIMARY KEY,
            reporter_name VARCHAR(128) NOT NULL,
            issue_type VARCHAR(64) NOT NULL,
            district VARCHAR(64) NOT NULL,
            locality VARCHAR(256) NOT NULL,
            date VARCHAR(32) NOT NULL,
            description TEXT NOT NULL,
            photo_url VARCHAR(512) NULL,
            status VARCHAR(32) DEFAULT 'pending_review',
            ai_summary TEXT NOT NULL,
            severity VARCHAR(32) DEFAULT 'medium',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """,
        """
        CREATE TABLE IF NOT EXISTS local_events (
            id VARCHAR(64) PRIMARY KEY,
            title VARCHAR(128) NOT NULL,
            category VARCHAR(64) NOT NULL,
            district VARCHAR(64) NOT NULL,
            location VARCHAR(256) NOT NULL,
            date VARCHAR(32) NOT NULL,
            time VARCHAR(32) NOT NULL,
            organizer VARCHAR(128) NOT NULL,
            description TEXT NOT NULL,
            participants_count INT DEFAULT 0,
            max_participants INT DEFAULT 100,
            environmental_objective TEXT NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """,
        """
        CREATE TABLE IF NOT EXISTS map_districts (
            id VARCHAR(64) PRIMARY KEY,
            name VARCHAR(128) NOT NULL,
            state VARCHAR(64) DEFAULT 'Tamil Nadu',
            coordinates_x FLOAT DEFAULT 0.0,
            coordinates_y FLOAT DEFAULT 0.0,
            lat FLOAT NOT NULL,
            lng FLOAT NOT NULL,
            environmental_score INT DEFAULT 75,
            environmental_level VARCHAR(32) DEFAULT 'good',
            community_action_score INT DEFAULT 80,
            trend VARCHAR(32) DEFAULT 'improving',
            aqi INT DEFAULT 60,
            waste_score INT DEFAULT 70,
            green_cover_percent FLOAT DEFAULT 25.0,
            water_quality_score INT DEFAULT 70,
            verified_community_actions INT DEFAULT 1000,
            cleanup_drives_count INT DEFAULT 20,
            active_reports_count INT DEFAULT 5,
            last_updated VARCHAR(64) DEFAULT 'Just now',
            ai_area_analysis TEXT NOT NULL,
            ai_recommended_action TEXT NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """,
        """
        CREATE TABLE IF NOT EXISTS map_pins (
            id VARCHAR(64) PRIMARY KEY,
            title VARCHAR(128) NOT NULL,
            category VARCHAR(64) NOT NULL,
            district VARCHAR(64) NOT NULL,
            lat FLOAT NOT NULL,
            lng FLOAT NOT NULL,
            details TEXT NOT NULL,
            verified_by VARCHAR(128) NULL,
            metric VARCHAR(64) NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """,
        """
        CREATE TABLE IF NOT EXISTS notifications (
            id VARCHAR(64) PRIMARY KEY,
            user_id VARCHAR(64) NOT NULL,
            title VARCHAR(128) NOT NULL,
            message VARCHAR(512) NOT NULL,
            type VARCHAR(32) DEFAULT 'verification',
            timestamp VARCHAR(64) DEFAULT 'Just now',
            is_read TINYINT(1) DEFAULT 0,
            action_url VARCHAR(256) NULL,
            metric_change VARCHAR(64) NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_notif_user (user_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """,
        """
        CREATE TABLE IF NOT EXISTS user_challenges (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(64) NOT NULL,
            challenge_id VARCHAR(64) NOT NULL,
            joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY uq_user_ch (user_id, challenge_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """,
        """
        CREATE TABLE IF NOT EXISTS user_events (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(64) NOT NULL,
            event_id VARCHAR(64) NOT NULL,
            joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY uq_user_ev (user_id, event_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """
    ]
    with get_db_cursor() as cursor:
        for stmt in create_statements:
            cursor.execute(stmt)
    logger.info("All MySQL tables verified successfully.")

def ensure_default_data():
    """Ensure baseline communities, districts, pins, and events exist in MySQL, specifically for Chennai."""
    import json
    with get_db_cursor() as cursor:
        # 1. Ensure Chennai district exists in map_districts
        cursor.execute("SELECT id FROM map_districts WHERE id = 'dist_che' OR name = 'Chennai';")
        if not cursor.fetchone():
            cursor.execute("""
                INSERT INTO map_districts (
                    id, name, state, coordinates_x, coordinates_y, lat, lng,
                    environmental_score, environmental_level, community_action_score,
                    trend, aqi, waste_score, green_cover_percent, water_quality_score,
                    verified_community_actions, cleanup_drives_count, active_reports_count,
                    last_updated, ai_area_analysis, ai_recommended_action
                ) VALUES (
                    'dist_che', 'Chennai', 'Tamil Nadu', 460.0, 160.0, 13.0827, 80.2707,
                    64, 'moderate', 81, 'improving', 88, 62, 15.1, 58,
                    9200, 72, 14, 'Just now',
                    'High urban density with major restoration underway at Pallikaranai marshland and Adyar river.',
                    'Decentralize organic waste processing and expand coastal mangrove belts.'
                );
            """)
            logger.info("Seeded Chennai in map_districts.")

        # 2. Ensure Chennai communities exist in communities table
        default_communities = [
            {
                'id': 'comm_che_01',
                'name': 'Chennai GreenGrid',
                'district': 'Chennai',
                'state': 'Tamil Nadu',
                'description': 'Coastal eco-activists spearheading beach cleanups, solar adoption, and rainwater harvesting initiatives across Chennai.',
                'members_count': 2890,
                'total_kg_co2e_avoided': 142500.0,
                'total_verified_actions': 32100,
                'total_trees_planted': 3200,
                'total_kg_waste_reduced': 68000.0,
                'total_liters_water_saved': 1200000.0,
                'environmental_score': 64,
                'community_action_score': 81,
                'trend': 'improving',
                'top_category': 'Water Conservation & Coastal Cleanups',
                'weakest_category': 'Air Conditioning Optimization',
                'joined_date': '2024-01-15',
                'active_challenges_json': json.dumps(['ch_commute_01', 'ch_trees_02']),
                'avatar_color': 'bg-teal-600'
            },
            {
                'id': 'comm_che_02',
                'name': 'Adyar Wetland & Coastal Guardians',
                'district': 'Chennai',
                'state': 'Tamil Nadu',
                'description': 'Grassroots ward collective safeguarding Pallikaranai marshland sanctuary, Adyar river basin, and citizen mangrove planting.',
                'members_count': 1450,
                'total_kg_co2e_avoided': 86200.0,
                'total_verified_actions': 18400,
                'total_trees_planted': 2100,
                'total_kg_waste_reduced': 41000.0,
                'total_liters_water_saved': 780000.0,
                'environmental_score': 64,
                'community_action_score': 81,
                'trend': 'improving',
                'top_category': 'Wetland & Mangrove Restoration',
                'weakest_category': 'Sustainable Commute',
                'joined_date': '2024-03-20',
                'active_challenges_json': json.dumps(['ch_trees_02']),
                'avatar_color': 'bg-cyan-600'
            }
        ]

        for comm in default_communities:
            cursor.execute("SELECT id FROM communities WHERE id = %s;", (comm['id'],))
            if not cursor.fetchone():
                cursor.execute("""
                    INSERT INTO communities (
                        id, name, district, state, description, members_count,
                        total_kg_co2e_avoided, total_verified_actions, total_trees_planted,
                        total_kg_waste_reduced, total_liters_water_saved, environmental_score,
                        community_action_score, trend, top_category, weakest_category,
                        joined_date, active_challenges_json, avatar_color
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
                """, (
                    comm['id'], comm['name'], comm['district'], comm['state'], comm['description'], comm['members_count'],
                    comm['total_kg_co2e_avoided'], comm['total_verified_actions'], comm['total_trees_planted'],
                    comm['total_kg_waste_reduced'], comm['total_liters_water_saved'], comm['environmental_score'],
                    comm['community_action_score'], comm['trend'], comm['top_category'], comm['weakest_category'],
                    comm['joined_date'], comm['active_challenges_json'], comm['avatar_color']
                ))
                logger.info(f"Seeded community: {comm['name']} ({comm['district']})")

        # 3. Ensure Chennai map pins exist in map_pins table
        chennai_pins = [
            {
                'id': 'pin_che_01',
                'title': 'Pallikaranai Marshland Ecological Buffer',
                'category': 'tree_plantation',
                'district': 'Chennai',
                'lat': 12.9349,
                'lng': 80.2137,
                'details': 'Ramsar Wetland Site; indigenous mangrove and halophyte planting for flood mitigation.',
                'verified_by': 'TN Wetlands Authority & CMWSSB',
                'metric': '+38.5 tons CO2e sequestered'
            },
            {
                'id': 'pin_che_02',
                'title': 'Besant Nagar Coastal Citizen Cleanup Zone',
                'category': 'waste_hotspot',
                'district': 'Chennai',
                'lat': 13.0001,
                'lng': 80.2667,
                'details': 'Zero-single-use-plastic beach audit and microplastic skimming initiative.',
                'verified_by': 'Greater Chennai Corporation (GCC)',
                'metric': '112 tons marine waste diverted'
            },
            {
                'id': 'pin_che_03',
                'title': 'Chennai GreenGrid Marina Eco-Corridor',
                'category': 'community',
                'district': 'Chennai',
                'lat': 13.0450,
                'lng': 80.2820,
                'details': 'Citizen solar adoption cluster and community rainwater recharging network.',
                'verified_by': 'Chennai GreenGrid',
                'metric': '2,890 active households'
            },
            {
                'id': 'pin_che_04',
                'title': 'OMR Low-Emission Mass Transit Belt',
                'category': 'action',
                'district': 'Chennai',
                'lat': 12.9716,
                'lng': 80.2452,
                'details': 'High-density electric bus and bicycle feeder corridor along Rajiv Gandhi IT Expressway.',
                'verified_by': 'MTC Chennai Climate Cell',
                'metric': '45,000 clean km logged'
            }
        ]

        for pin in chennai_pins:
            cursor.execute("SELECT id FROM map_pins WHERE id = %s;", (pin['id'],))
            if not cursor.fetchone():
                cursor.execute("""
                    INSERT INTO map_pins (
                        id, title, category, district, lat, lng, details, verified_by, metric
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);
                """, (
                    pin['id'], pin['title'], pin['category'], pin['district'],
                    pin['lat'], pin['lng'], pin['details'], pin['verified_by'], pin['metric']
                ))
                logger.info(f"Seeded map pin: {pin['title']} ({pin['district']})")

        # 4. Ensure Chennai local event exists
        cursor.execute("SELECT id FROM local_events WHERE district = 'Chennai' LIMIT 1;")
        if not cursor.fetchone():
            cursor.execute("""
                INSERT INTO local_events (
                    id, title, category, district, location, date, time, organizer,
                    description, participants_count, max_participants, environmental_objective
                ) VALUES (
                    'evt_che_01', 'Marina Beach Marine Litter Audit & Mangrove Plantation', 'community_action',
                    'Chennai', 'Besant Nagar Coastal Promenade, Chennai', '2025-06-05', '06:00 AM - 09:30 AM',
                    'Chennai GreenGrid & Coastal Protection Bureau',
                    'Beach plastic clean drive and brackish-water native mangrove sapling plantation along estuarine bank.',
                    142, 200, 'Prevent 1.5 tons plastic entering Bay of Bengal and anchor 250 mangrove propagules.'
                );
            """)
            logger.info("Seeded Chennai local event.")
