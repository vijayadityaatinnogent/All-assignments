import logging
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
logger = logging.getLogger('ProductManagementAPI')
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)
class RequestLoggerMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        logger.info(f'Request: {request.method} {request.url}')
        response = await call_next(request)
        logger.info(f'Response: {response.status_code} for {request.method} {request.url}')
        return response