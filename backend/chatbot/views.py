from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import ChatSession, ChatMessage
from .serializers import ChatSessionSerializer, ChatMessageSerializer
from .utils import get_ai_response

class ChatSessionViewSet(viewsets.ModelViewSet):
    serializer_class = ChatSessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ChatSession.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def ask(self, request, pk=None):
        """Ask a question to the CV-based chatbot."""
        session = self.get_object()
        
        if 'message' not in request.data:
            return Response(
                {'error': 'Message is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user_message = request.data['message']
        
        # Save user message
        ChatMessage.objects.create(
            session=session,
            role='user',
            content=user_message
        )
        
        # Get the CV content
        cv = session.cv
        
        if not cv.is_processed or not cv.content:
            return Response(
                {'error': 'CV has not been properly processed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get AI response
        ai_response = get_ai_response(cv.content, user_message)
        
        # Save AI message
        ai_message = ChatMessage.objects.create(
            session=session,
            role='ai',
            content=ai_response["answer"],
            citations=ai_response["citations"],
        )
        
        # Update session timestamp
        session.save()
        
        return Response(
            ChatMessageSerializer(ai_message).data,
            status=status.HTTP_201_CREATED
        )
