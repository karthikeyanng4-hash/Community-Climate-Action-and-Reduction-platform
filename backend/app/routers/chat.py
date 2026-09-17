from fastapi import APIRouter, HTTPException, status
from app.schemas import (
    AiChatRequest,
    AiChatResponse,
    ImageValidationRequest,
    ImageValidationResult
)
from app.ai_service import (
    get_climate_assistant_response,
    validate_activity_image_async,
    ImageValidationError,
    UnsupportedActivityError,
    OllamaServiceUnavailableError
)

router = APIRouter(prefix="/ai", tags=["AI Climate Assistant"])

@router.post("/chat", response_model=AiChatResponse)
def assistant_chat(request: AiChatRequest):
    return get_climate_assistant_response(request.message, request.district or "Coimbatore")

@router.post("/validate-image", response_model=ImageValidationResult)
async def validate_image_endpoint(request: ImageValidationRequest):
    """
    Validates user-uploaded image evidence against a selected climate action
    using local Gemma 3 Vision on Ollama.
    """
    try:
        result = await validate_activity_image_async(
            image_input=request.image,
            activity_name=request.activity,
            description=request.description
        )
        return result
    except ImageValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except UnsupportedActivityError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )
    except OllamaServiceUnavailableError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while validating the image."
        )
