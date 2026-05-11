from fastapi import APIRouter
from starlette.responses import Response

router = APIRouter()


@router.get("/health")
@router.get("/health/")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@router.head("/health")
@router.head("/health/")
async def health_head() -> Response:
    """Panels that probe with HEAD (no JSON body) still get HTTP 200."""
    return Response(status_code=200)
