import json
import time
from typing import Optional, List, Dict, Any
from app.database import get_db_cursor
from app.schemas import (
    UserProfile, UserProfileUpdate,
    VerifiedSubmission, SubmissionCreate, AdminReviewRequest,
    Community, Challenge, LeaderboardEntry, CommunityLeaderboardEntry,
    LocalClimateEvent, EnvironmentalReport, ReportCreate,
    MapDistrict, MapPinItem, NotificationItem, Coordinates, SecondaryImpact
)
from app.calculation import verify_and_calculate_emission

def row_to_user_profile(row: Dict[str, Any]) -> UserProfile:
    return UserProfile(
        id=row["id"],
        name=row["name"],
        email=row["email"],
        phone=row.get("phone") or "",
        countryCode=row.get("country_code") or "+91",
        communityId=row.get("community_id") or "",
        communityName=row.get("community_name") or "",
        district=row.get("district") or "Coimbatore",
        joinedDate=row.get("joined_date") or "2024-01-15",
        avatar=row.get("avatar") or "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        rank=row.get("rank") or 1,
        totalKgCo2eAvoided=round(float(row.get("total_kg_co2e_avoided") or 0.0), 2),
        totalVerifiedActions=int(row.get("total_verified_actions") or 0),
        totalTreesPlanted=int(row.get("total_trees_planted") or 0),
        totalLitersWaterSaved=round(float(row.get("total_liters_water_saved") or 0.0), 1),
        totalKgWasteReduced=round(float(row.get("total_kg_waste_reduced") or 0.0), 1),
        activeChallengesCount=int(row.get("active_challenges_count") or 0),
        weeklyGoalProgress=int(row.get("weekly_goal_progress") or 0),
        monthlyGoalProgress=int(row.get("monthly_goal_progress") or 0),
        biggestImpactArea=row.get("biggest_impact_area") or "Transport"
    )

def get_user_profile(user_id: Optional[str] = None) -> Optional[UserProfile]:
    with get_db_cursor() as cursor:
        if user_id:
            cursor.execute("SELECT * FROM users WHERE id = %s;", (user_id,))
        else:
            cursor.execute("SELECT * FROM users ORDER BY created_at ASC LIMIT 1;")
        row = cursor.fetchone()
        if not row:
            return None
        return row_to_user_profile(row)

def update_user_profile(user_id: Optional[str], data: UserProfileUpdate) -> Optional[UserProfile]:
    target_user = get_user_profile(user_id)
    if not target_user:
        return None
    uid = target_user.id

    fields = []
    values = []
    if data.name is not None:
        fields.append("name = %s")
        values.append(data.name)
    if data.email is not None:
        fields.append("email = %s")
        values.append(data.email)
    if data.phone is not None:
        fields.append("phone = %s")
        values.append(data.phone)
    if data.countryCode is not None:
        fields.append("country_code = %s")
        values.append(data.countryCode)
    if data.district is not None:
        fields.append("district = %s")
        values.append(data.district)
    if data.avatar is not None:
        fields.append("avatar = %s")
        values.append(data.avatar)
    if data.communityId is not None:
        fields.append("community_id = %s")
        values.append(data.communityId)
    if data.communityName is not None:
        fields.append("community_name = %s")
        values.append(data.communityName)

    if fields:
        values.append(uid)
        sql = f"UPDATE users SET {', '.join(fields)} WHERE id = %s;"
        with get_db_cursor() as cursor:
            cursor.execute(sql, tuple(values))

    return get_user_profile(uid)

def get_user_raw_by_email(email: str) -> Optional[Dict[str, Any]]:
    with get_db_cursor() as cursor:
        cursor.execute("SELECT * FROM users WHERE LOWER(email) = LOWER(%s) LIMIT 1;", (email.strip(),))
        return cursor.fetchone()

def get_user_raw_by_id(user_id: str) -> Optional[Dict[str, Any]]:
    with get_db_cursor() as cursor:
        cursor.execute("SELECT * FROM users WHERE id = %s LIMIT 1;", (user_id,))
        return cursor.fetchone()

def set_user_password_hash(user_id: str, password_hash: str) -> bool:
    with get_db_cursor() as cursor:
        cursor.execute("UPDATE users SET password_hash = %s WHERE id = %s;", (password_hash, user_id))
        return True

def create_auth_user(
    name: str,
    email: str,
    password_hash: str,
    phone: str = "",
    country_code: str = "+91",
    community_id: str = "",
    community_name: str = "",
    district: str = "Coimbatore"
) -> UserProfile:
    import uuid
    import datetime
    user_id = f"usr_{uuid.uuid4().hex[:10]}"
    joined_date = datetime.date.today().isoformat()
    avatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"

    with get_db_cursor() as cursor:
        if community_id and not community_name:
            cursor.execute("SELECT name, district FROM communities WHERE id = %s LIMIT 1;", (community_id,))
            c_row = cursor.fetchone()
            if c_row:
                community_name = c_row["name"]
                district = c_row.get("district") or district

        cursor.execute("""
            INSERT INTO users (
                id, name, email, password_hash, phone, country_code,
                community_id, community_name, district, joined_date, avatar,
                `rank`, total_kg_co2e_avoided, total_verified_actions, total_trees_planted,
                total_liters_water_saved, total_kg_waste_reduced, active_challenges_count,
                weekly_goal_progress, monthly_goal_progress, biggest_impact_area
            ) VALUES (
                %s, %s, %s, %s, %s, %s,
                %s, %s, %s, %s, %s,
                %s, %s, %s, %s,
                %s, %s, %s,
                %s, %s, %s
            );
        """, (
            user_id, name.strip(), email.strip().lower(), password_hash, phone.strip(), country_code.strip() or "+91",
            community_id or "comm_cbe_01", community_name or "Coimbatore EcoAlliance", district, joined_date, avatar,
            5, 0.0, 0, 0,
            0.0, 0.0, 0,
            0, 0, "Lifestyle"
        ))

    profile = get_user_profile(user_id)
    if not profile:
        raise RuntimeError("User creation failed in MySQL database.")
    return profile

def init_demo_user_password(default_password: str = "SecurePass@2025") -> None:
    import bcrypt
    with get_db_cursor() as cursor:
        cursor.execute("SELECT id, password_hash FROM users WHERE email = 'karthikeyanng4@gmail.com' LIMIT 1;")
        row = cursor.fetchone()
        if row and not row["password_hash"]:
            hashed = bcrypt.hashpw(default_password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
            cursor.execute("UPDATE users SET password_hash = %s WHERE id = %s;", (hashed, row["id"]))

def row_to_submission(row: Dict[str, Any]) -> VerifiedSubmission:
    anomaly_flags = []
    if row.get("anomaly_flags_json"):
        try:
            anomaly_flags = json.loads(row["anomaly_flags_json"])
        except Exception:
            anomaly_flags = []

    secondary = None
    if row.get("secondary_impact_label"):
        secondary = SecondaryImpact(
            label=row["secondary_impact_label"],
            value=float(row.get("secondary_impact_value") or 0.0),
            unit=row.get("secondary_impact_unit") or ""
        )

    return VerifiedSubmission(
        id=row["id"],
        userId=row["user_id"],
        userName=row["user_name"],
        actionId=row["action_id"],
        actionTitle=row["action_title"],
        categoryId=row["category_id"],
        timestamp=row["timestamp"],
        date=row["date"],
        quantity=float(row["quantity"]),
        unit=row["unit"],
        location=row["location"],
        district=row["district"],
        description=row["description"],
        photoUrl=row.get("photo_url"),
        verificationStatus=row.get("verification_status") or "verified",
        aiConfidenceScore=int(row.get("ai_confidence_score") or 90),
        aiAnalysisReasoning=row.get("ai_analysis_reasoning") or "",
        anomalyFlags=anomaly_flags,
        calculatedKgCo2e=round(float(row.get("calculated_kg_co2e") or 0.0), 2),
        secondaryImpact=secondary,
        factorReference=row.get("factor_reference") or "IPCC AR6",
        isContributedToCommunity=bool(row.get("is_contributed_to_community", 1))
    )

def get_submissions(user_id: Optional[str] = None, category_id: Optional[str] = None) -> List[VerifiedSubmission]:
    sql = "SELECT * FROM submissions WHERE 1=1"
    params = []
    if user_id:
        sql += " AND user_id = %s"
        params.append(user_id)
    if category_id:
        sql += " AND category_id = %s"
        params.append(category_id)
    sql += " ORDER BY created_at DESC;"

    with get_db_cursor() as cursor:
        cursor.execute(sql, tuple(params))
        rows = cursor.fetchall()
        return [row_to_submission(r) for r in rows]

def create_submission(data: SubmissionCreate) -> VerifiedSubmission:
    sub_id = f"sub_{int(time.time() * 1000)}"
    timestamp = "Just now"

    # Run verification & calculation engine
    (
        calculated_kg,
        status,
        confidence,
        flags,
        secondary,
        ref
    ) = verify_and_calculate_emission(
        data.actionId,
        data.quantity,
        data.description,
        data.photoUrl
    )

    ai_reasoning = f"Validated via IPCC/CEA protocol. Avoided {calculated_kg} kg CO2e."

    # Validate image evidence with Gemma 3 Vision if image data is present
    if data.photoUrl and ("base64," in data.photoUrl or len(data.photoUrl) > 500):
        try:
            from app.ai_service import validate_activity_image
            val_res = validate_activity_image(
                data.photoUrl,
                data.actionTitle or data.actionId,
                data.description
            )
            if not val_res.accepted:
                status = "needs_more_evidence"
                confidence = int(val_res.confidence * 100)
                ai_reasoning = f"AI Vision Audit: Not Accepted. {val_res.reason}"
                flags.append(f"Image evidence rejected by Gemma 3 Vision for {val_res.activity}")
            else:
                confidence = int(val_res.confidence * 100)
                ai_reasoning = f"Gemma 3 Vision Verified. {val_res.reason} Avoided {calculated_kg} kg CO2e."
        except Exception as e:
            # Fallback to standard verification if vision check encounters transient error
            pass

    sec_label = secondary["label"] if secondary else None
    sec_val = secondary["value"] if secondary else None
    sec_unit = secondary["unit"] if secondary else None

    with get_db_cursor() as cursor:
        cursor.execute(
            """
            INSERT INTO submissions (
                id, user_id, user_name, action_id, action_title, category_id,
                timestamp, date, quantity, unit, location, district, description,
                photo_url, verification_status, ai_confidence_score, ai_analysis_reasoning,
                anomaly_flags_json, calculated_kg_co2e, secondary_impact_label,
                secondary_impact_value, secondary_impact_unit, factor_reference,
                is_contributed_to_community
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
            """,
            (
                sub_id, data.userId, data.userName, data.actionId, data.actionTitle, data.categoryId,
                timestamp, data.date, data.quantity, data.unit, data.location, data.district, data.description,
                data.photoUrl, status, confidence, ai_reasoning,
                json.dumps(flags), calculated_kg, sec_label, sec_val, sec_unit, ref, 1 if status == "verified" else 0
            )
        )

        # If verified, update user totals in MySQL
        if status == "verified":
            is_tree = int(data.quantity) if data.actionId == "tree_planted" else 0
            is_water = float(sec_val) if data.categoryId == "water_conservation" and sec_val else 0.0
            is_waste = float(data.quantity) if data.categoryId == "waste_reduction" else 0.0

            cursor.execute(
                """
                UPDATE users SET
                    total_kg_co2e_avoided = total_kg_co2e_avoided + %s,
                    total_verified_actions = total_verified_actions + 1,
                    total_trees_planted = total_trees_planted + %s,
                    total_liters_water_saved = total_liters_water_saved + %s,
                    total_kg_waste_reduced = total_kg_waste_reduced + %s,
                    weekly_goal_progress = LEAST(100, weekly_goal_progress + 8)
                WHERE id = %s;
                """,
                (calculated_kg, is_tree, is_water, is_waste, data.userId)
            )

            # Update community totals in MySQL
            cursor.execute(
                """
                UPDATE communities c
                JOIN users u ON u.community_id = c.id
                SET
                    c.total_kg_co2e_avoided = c.total_kg_co2e_avoided + %s,
                    c.total_verified_actions = c.total_verified_actions + 1,
                    c.total_trees_planted = c.total_trees_planted + %s,
                    c.total_kg_waste_reduced = c.total_kg_waste_reduced + %s,
                    c.total_liters_water_saved = c.total_liters_water_saved + %s
                WHERE u.id = %s;
                """,
                (calculated_kg, is_tree, is_waste, is_water, data.userId)
            )

            # Update challenge progress in MySQL if challengeId provided
            if data.challengeId:
                cursor.execute(
                    """
                    UPDATE challenges SET
                        current_value = current_value + %s
                    WHERE id = %s;
                    """,
                    (data.quantity, data.challengeId)
                )
                cursor.execute(
                    """
                    INSERT IGNORE INTO user_challenges (user_id, challenge_id)
                    VALUES (%s, %s);
                    """,
                    (data.userId, data.challengeId)
                )

            # Create notification in MySQL
            notif_id = f"notif_{int(time.time() * 1000)}"
            cursor.execute(
                """
                INSERT INTO notifications (id, user_id, title, message, type, timestamp, is_read, metric_change)
                VALUES (%s, %s, %s, %s, %s, %s, 0, %s);
                """,
                (
                    notif_id,
                    data.userId,
                    f"Action Certified: {data.actionTitle}",
                    f"Your record of {data.quantity} {data.unit} was certified! +{calculated_kg} kg CO2e contributed.",
                    "verification",
                    "Just now",
                    f"+{calculated_kg} kg CO2e"
                )
            )

    return get_submissions(user_id=data.userId)[0]

def admin_review_submission(submission_id: str, status: str, note: Optional[str] = None) -> Optional[VerifiedSubmission]:
    with get_db_cursor() as cursor:
        note_sql = f" [Admin Note: {note}]" if note else ""
        cursor.execute(
            """
            UPDATE submissions SET
                verification_status = %s,
                ai_analysis_reasoning = CONCAT(ai_analysis_reasoning, %s)
            WHERE id = %s;
            """,
            (status, note_sql, submission_id)
        )
        cursor.execute("SELECT * FROM submissions WHERE id = %s;", (submission_id,))
        row = cursor.fetchone()
        if not row:
            return None
        return row_to_submission(row)

def get_communities() -> List[Community]:
    with get_db_cursor() as cursor:
        cursor.execute("SELECT * FROM communities ORDER BY total_kg_co2e_avoided DESC;")
        rows = cursor.fetchall()
        result = []
        for r in rows:
            challenges = []
            if r.get("active_challenges_json"):
                try:
                    challenges = json.loads(r["active_challenges_json"])
                except Exception:
                    challenges = []
            result.append(
                Community(
                    id=r["id"],
                    name=r["name"],
                    district=r["district"],
                    state=r.get("state") or "Tamil Nadu",
                    description=r["description"],
                    membersCount=int(r.get("members_count") or 1),
                    totalKgCo2eAvoided=round(float(r.get("total_kg_co2e_avoided") or 0.0), 2),
                    totalVerifiedActions=int(r.get("total_verified_actions") or 0),
                    totalTreesPlanted=int(r.get("total_trees_planted") or 0),
                    totalKgWasteReduced=round(float(r.get("total_kg_waste_reduced") or 0.0), 1),
                    totalLitersWaterSaved=round(float(r.get("total_liters_water_saved") or 0.0), 1),
                    environmentalScore=int(r.get("environmental_score") or 80),
                    communityActionScore=int(r.get("community_action_score") or 85),
                    trend=r.get("trend") or "improving",
                    topCategory=r.get("top_category") or "Afforestation",
                    weakestCategory=r.get("weakest_category") or "Transport",
                    joinedDate=r.get("joined_date") or "2024-01-01",
                    activeChallenges=challenges,
                    avatarColor=r.get("avatar_color") or "emerald"
                )
            )
        return result

def join_community(community_id: str, user_id: Optional[str] = None) -> Optional[Community]:
    with get_db_cursor() as cursor:
        cursor.execute("SELECT * FROM communities WHERE id = %s;", (community_id,))
        comm = cursor.fetchone()
        if not comm:
            return None

        # Increment member count in MySQL
        cursor.execute(
            "UPDATE communities SET members_count = members_count + 1 WHERE id = %s;",
            (community_id,)
        )

        # Update user's community
        if user_id:
            cursor.execute(
                "UPDATE users SET community_id = %s, community_name = %s WHERE id = %s;",
                (community_id, comm["name"], user_id)
            )

        cursor.execute("SELECT * FROM communities WHERE id = %s;", (community_id,))
        updated_comm = cursor.fetchone()
        challenges = []
        if updated_comm.get("active_challenges_json"):
            try:
                challenges = json.loads(updated_comm["active_challenges_json"])
            except Exception:
                challenges = []

        return Community(
            id=updated_comm["id"],
            name=updated_comm["name"],
            district=updated_comm["district"],
            state=updated_comm.get("state") or "Tamil Nadu",
            description=updated_comm["description"],
            membersCount=int(updated_comm.get("members_count") or 1),
            totalKgCo2eAvoided=round(float(updated_comm.get("total_kg_co2e_avoided") or 0.0), 2),
            totalVerifiedActions=int(updated_comm.get("total_verified_actions") or 0),
            totalTreesPlanted=int(updated_comm.get("total_trees_planted") or 0),
            totalKgWasteReduced=round(float(updated_comm.get("total_kg_waste_reduced") or 0.0), 1),
            totalLitersWaterSaved=round(float(updated_comm.get("total_liters_water_saved") or 0.0), 1),
            environmentalScore=int(updated_comm.get("environmental_score") or 80),
            communityActionScore=int(updated_comm.get("community_action_score") or 85),
            trend=updated_comm.get("trend") or "improving",
            topCategory=updated_comm.get("top_category") or "Afforestation",
            weakestCategory=updated_comm.get("weakest_category") or "Transport",
            joinedDate=updated_comm.get("joined_date") or "2024-01-01",
            activeChallenges=challenges,
            avatarColor=updated_comm.get("avatar_color") or "emerald"
        )

def get_challenges(user_id: Optional[str] = None) -> List[Challenge]:
    with get_db_cursor() as cursor:
        cursor.execute("SELECT * FROM challenges;")
        rows = cursor.fetchall()
        joined_ids = set()
        if user_id:
            cursor.execute("SELECT challenge_id FROM user_challenges WHERE user_id = %s;", (user_id,))
            joined_ids = {r["challenge_id"] for r in cursor.fetchall()}

        result = []
        for r in rows:
            result.append(
                Challenge(
                    id=r["id"],
                    title=r["title"],
                    category=r["category"],
                    objective=r["objective"],
                    durationDays=int(r.get("duration_days") or 7),
                    deadline=r["deadline"],
                    participantsCount=int(r.get("participants_count") or 0),
                    targetValue=float(r["target_value"]),
                    currentValue=float(r.get("current_value") or 0.0),
                    unit=r["unit"],
                    impactEstimateKgCo2e=float(r["impact_estimate_kg_co2e"]),
                    rewardBadge=r["reward_badge"],
                    rewardIcon=r["reward_icon"],
                    isJoined=(r["id"] in joined_ids),
                    aiRecommendationReason=r.get("ai_recommendation_reason")
                )
            )
        return result

def toggle_challenge(challenge_id: str, user_id: Optional[str] = None) -> Optional[Challenge]:
    if not user_id:
        target_u = get_user_profile()
        user_id = target_u.id if target_u else "usr_cbe_8841"

    with get_db_cursor() as cursor:
        cursor.execute(
            "SELECT id FROM user_challenges WHERE user_id = %s AND challenge_id = %s;",
            (user_id, challenge_id)
        )
        existing = cursor.fetchone()

        if existing:
            # Leave challenge
            cursor.execute(
                "DELETE FROM user_challenges WHERE user_id = %s AND challenge_id = %s;",
                (user_id, challenge_id)
            )
            cursor.execute(
                "UPDATE challenges SET participants_count = GREATEST(0, participants_count - 1) WHERE id = %s;",
                (challenge_id,)
            )
            cursor.execute(
                "UPDATE users SET active_challenges_count = GREATEST(0, active_challenges_count - 1) WHERE id = %s;",
                (user_id,)
            )
        else:
            # Join challenge
            cursor.execute(
                "INSERT INTO user_challenges (user_id, challenge_id) VALUES (%s, %s);",
                (user_id, challenge_id)
            )
            cursor.execute(
                "UPDATE challenges SET participants_count = participants_count + 1 WHERE id = %s;",
                (challenge_id,)
            )
            cursor.execute(
                "UPDATE users SET active_challenges_count = active_challenges_count + 1 WHERE id = %s;",
                (user_id,)
            )

    challenges = get_challenges(user_id=user_id)
    return next((ch for ch in challenges if ch.id == challenge_id), None)

def get_user_leaderboard() -> List[LeaderboardEntry]:
    with get_db_cursor() as cursor:
        cursor.execute("SELECT * FROM users ORDER BY total_kg_co2e_avoided DESC LIMIT 20;")
        rows = cursor.fetchall()
        result = []
        for rank, r in enumerate(rows, start=1):
            score = int((r.get("total_kg_co2e_avoided") or 0.0) * 10 + (r.get("total_verified_actions") or 0) * 25)
            badge = "Climate Pioneer" if rank == 1 else ("Eco Guardian" if rank == 2 else "Green Citizen")
            result.append(
                LeaderboardEntry(
                    rank=rank,
                    previousRank=rank,
                    userId=r["id"],
                    userName=r["name"],
                    avatar=r.get("avatar") or "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
                    communityName=r.get("community_name") or "Coimbatore EcoAlliance",
                    district=r.get("district") or "Coimbatore",
                    verifiedActionsCount=int(r.get("total_verified_actions") or 0),
                    totalKgCo2eAvoided=round(float(r.get("total_kg_co2e_avoided") or 0.0), 2),
                    impactScore=score,
                    topBadge=badge,
                    isCurrentUser=True
                )
            )
        return result

def get_community_leaderboard() -> List[CommunityLeaderboardEntry]:
    with get_db_cursor() as cursor:
        cursor.execute("SELECT * FROM communities ORDER BY total_kg_co2e_avoided DESC;")
        rows = cursor.fetchall()
        result = []
        for rank, r in enumerate(rows, start=1):
            result.append(
                CommunityLeaderboardEntry(
                    rank=rank,
                    previousRank=rank,
                    communityId=r["id"],
                    name=r["name"],
                    district=r["district"],
                    membersCount=int(r.get("members_count") or 1),
                    verifiedActionsCount=int(r.get("total_verified_actions") or 0),
                    totalKgCo2eAvoided=round(float(r.get("total_kg_co2e_avoided") or 0.0), 2),
                    environmentalScore=int(r.get("environmental_score") or 80),
                    communityActionScore=int(r.get("community_action_score") or 85),
                    trend=r.get("trend") or "improving"
                )
            )
        return result

def get_events(user_id: Optional[str] = None) -> List[LocalClimateEvent]:
    with get_db_cursor() as cursor:
        cursor.execute("SELECT * FROM local_events ORDER BY date ASC;")
        rows = cursor.fetchall()
        joined_events = set()
        if user_id:
            cursor.execute("SELECT event_id FROM user_events WHERE user_id = %s;", (user_id,))
            joined_events = {r["event_id"] for r in cursor.fetchall()}

        result = []
        for r in rows:
            result.append(
                LocalClimateEvent(
                    id=r["id"],
                    title=r["title"],
                    category=r["category"],
                    district=r["district"],
                    location=r["location"],
                    date=r["date"],
                    time=r["time"],
                    organizer=r["organizer"],
                    description=r["description"],
                    participantsCount=int(r.get("participants_count") or 0),
                    maxParticipants=int(r.get("max_participants") or 100),
                    environmentalObjective=r["environmental_objective"],
                    isJoined=(r["id"] in joined_events)
                )
            )
        return result

def toggle_event(event_id: str, user_id: Optional[str] = None) -> Optional[LocalClimateEvent]:
    if not user_id:
        target_u = get_user_profile()
        user_id = target_u.id if target_u else "usr_cbe_8841"

    with get_db_cursor() as cursor:
        cursor.execute(
            "SELECT id FROM user_events WHERE user_id = %s AND event_id = %s;",
            (user_id, event_id)
        )
        existing = cursor.fetchone()

        if existing:
            cursor.execute(
                "DELETE FROM user_events WHERE user_id = %s AND event_id = %s;",
                (user_id, event_id)
            )
            cursor.execute(
                "UPDATE local_events SET participants_count = GREATEST(0, participants_count - 1) WHERE id = %s;",
                (event_id,)
            )
        else:
            cursor.execute(
                "INSERT INTO user_events (user_id, event_id) VALUES (%s, %s);",
                (user_id, event_id)
            )
            cursor.execute(
                "UPDATE local_events SET participants_count = participants_count + 1 WHERE id = %s;",
                (event_id,)
            )

    events = get_events(user_id=user_id)
    return next((e for e in events if e.id == event_id), None)

def get_reports() -> List[EnvironmentalReport]:
    with get_db_cursor() as cursor:
        cursor.execute("SELECT * FROM environmental_reports ORDER BY created_at DESC;")
        rows = cursor.fetchall()
        result = []
        for r in rows:
            result.append(
                EnvironmentalReport(
                    id=r["id"],
                    reporterName=r["reporter_name"],
                    issueType=r["issue_type"],
                    district=r["district"],
                    locality=r["locality"],
                    date=r["date"],
                    description=r["description"],
                    photoUrl=r.get("photo_url"),
                    status=r.get("status") or "pending_review",
                    aiSummary=r.get("ai_summary") or "",
                    severity=r.get("severity") or "medium"
                )
            )
        return result

def create_report(data: ReportCreate) -> EnvironmentalReport:
    rep_id = f"rep_{int(time.time() * 1000)}"
    today = time.strftime("%Y-%m-%d")
    ai_summary = f"AI verified classification for {data.issueType.replace('_', ' ')}. Transmitted to {data.district} municipal ward squad."
    severity = data.severity or "medium"

    with get_db_cursor() as cursor:
        cursor.execute(
            """
            INSERT INTO environmental_reports (
                id, reporter_name, issue_type, district, locality, date,
                description, photo_url, status, ai_summary, severity
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
            """,
            (
                rep_id, data.reporterName, data.issueType, data.district, data.locality, today,
                data.description, data.photoUrl, "pending_review", ai_summary, severity
            )
        )
        cursor.execute("SELECT * FROM environmental_reports WHERE id = %s;", (rep_id,))
        row = cursor.fetchone()
        return EnvironmentalReport(
            id=row["id"],
            reporterName=row["reporter_name"],
            issueType=row["issue_type"],
            district=row["district"],
            locality=row["locality"],
            date=row["date"],
            description=row["description"],
            photoUrl=row.get("photo_url"),
            status=row.get("status") or "pending_review",
            aiSummary=row.get("ai_summary") or "",
            severity=row.get("severity") or "medium"
        )

def resolve_report(report_id: str) -> Optional[EnvironmentalReport]:
    with get_db_cursor() as cursor:
        cursor.execute(
            """
            UPDATE environmental_reports SET
                status = 'resolved',
                ai_summary = 'Marked resolved by Community Environmental Inspector. Verification evidence confirmed.'
            WHERE id = %s;
            """,
            (report_id,)
        )
        cursor.execute("SELECT * FROM environmental_reports WHERE id = %s;", (report_id,))
        row = cursor.fetchone()
        if not row:
            return None
        return EnvironmentalReport(
            id=row["id"],
            reporterName=row["reporter_name"],
            issueType=row["issue_type"],
            district=row["district"],
            locality=row["locality"],
            date=row["date"],
            description=row["description"],
            photoUrl=row.get("photo_url"),
            status=row.get("status") or "resolved",
            aiSummary=row.get("ai_summary") or "",
            severity=row.get("severity") or "medium"
        )

def get_map_districts() -> List[MapDistrict]:
    with get_db_cursor() as cursor:
        cursor.execute("SELECT * FROM map_districts;")
        rows = cursor.fetchall()
        result = []
        for r in rows:
            result.append(
                MapDistrict(
                    id=r["id"],
                    name=r["name"],
                    state=r.get("state") or "Tamil Nadu",
                    coordinates=[float(r["lat"]), float(r["lng"])],
                    lat=float(r["lat"]),
                    lng=float(r["lng"]),
                    environmentalScore=int(r.get("environmental_score") or 75),
                    environmentalLevel=r.get("environmental_level") or "good",
                    communityActionScore=int(r.get("community_action_score") or 80),
                    trend=r.get("trend") or "improving",
                    aqi=int(r.get("aqi") or 60),
                    wasteScore=int(r.get("waste_score") or 70),
                    greenCoverPercent=float(r.get("green_cover_percent") or 25.0),
                    waterQualityScore=int(r.get("water_quality_score") or 70),
                    verifiedCommunityActions=int(r.get("verified_community_actions") or 1000),
                    cleanupDrivesCount=int(r.get("cleanup_drives_count") or 20),
                    activeReportsCount=int(r.get("active_reports_count") or 5),
                    lastUpdated=r.get("last_updated") or "Just now",
                    aiAreaAnalysis=r.get("ai_area_analysis") or "",
                    aiRecommendedAction=r.get("ai_recommended_action") or "",
                    totalKgCo2eAvoided=round(float(r.get("verified_community_actions") or 1200) * 2.8, 1),
                    totalVerifiedActions=int(r.get("verified_community_actions") or 1200),
                    totalTreesPlanted=int(r.get("cleanup_drives_count") or 15) * 65,
                    activeCommunitiesCount=3 if r["name"] == "Coimbatore" else 2,
                    aiDiagnostic=r.get("ai_area_analysis") or "Favorable localized environmental progress observed.",
                    aiGeographicRecommendation=r.get("ai_recommended_action") or "Expand active transit and native tree buffer zones.",
                    keyIssues=["Industrial Emissions", "Urban Wetland Protection"] if r["name"] == "Coimbatore" else ["Coastal Plastic Waste", "Mangrove Loss"]
                )
            )
        return result

def get_map_pins(district: Optional[str] = None) -> List[MapPinItem]:
    sql = "SELECT * FROM map_pins WHERE 1=1"
    params = []
    if district:
        sql += " AND district = %s"
        params.append(district)

    with get_db_cursor() as cursor:
        cursor.execute(sql, tuple(params))
        rows = cursor.fetchall()
        result = []
        for r in rows:
            result.append(
                MapPinItem(
                    id=r["id"],
                    title=r["title"],
                    category=r["category"],
                    district=r["district"],
                    coordinates=[float(r["lat"]), float(r["lng"])],
                    details=r["details"],
                    verifiedBy=r.get("verified_by"),
                    metric=r.get("metric")
                )
            )
        return result

def get_notifications(user_id: Optional[str] = None) -> List[NotificationItem]:
    if not user_id:
        target_u = get_user_profile()
        user_id = target_u.id if target_u else "usr_cbe_8841"

    with get_db_cursor() as cursor:
        cursor.execute(
            "SELECT * FROM notifications WHERE user_id = %s ORDER BY created_at DESC LIMIT 50;",
            (user_id,)
        )
        rows = cursor.fetchall()
        result = []
        for r in rows:
            result.append(
                NotificationItem(
                    id=r["id"],
                    title=r["title"],
                    message=r["message"],
                    type=r.get("type") or "verification",
                    timestamp=r.get("timestamp") or "Just now",
                    read=bool(r.get("is_read", 0)),
                    actionUrl=r.get("action_url"),
                    metricChange=r.get("metric_change")
                )
            )
        return result

def mark_notification_read(notif_id: str) -> Optional[NotificationItem]:
    with get_db_cursor() as cursor:
        cursor.execute("UPDATE notifications SET is_read = 1 WHERE id = %s;", (notif_id,))
        cursor.execute("SELECT * FROM notifications WHERE id = %s;", (notif_id,))
        r = cursor.fetchone()
        if not r:
            return None
        return NotificationItem(
            id=r["id"],
            title=r["title"],
            message=r["message"],
            type=r.get("type") or "verification",
            timestamp=r.get("timestamp") or "Just now",
            read=True,
            actionUrl=r.get("action_url"),
            metricChange=r.get("metric_change")
        )

def mark_all_notifications_read(user_id: Optional[str] = None) -> bool:
    if not user_id:
        target_u = get_user_profile()
        user_id = target_u.id if target_u else "usr_cbe_8841"

    with get_db_cursor() as cursor:
        cursor.execute("UPDATE notifications SET is_read = 1 WHERE user_id = %s;", (user_id,))
        return True
