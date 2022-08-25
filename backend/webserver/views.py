from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

#from .models import Student
from .models import User, Demo, Instance, Host, FeedbackType, Feedback
from .serializers import *

# @api_view(['GET', 'POST'])
# def students_list(request):
#     if request.method == 'GET':
#         data = Student.objects.all()

#         serializer = StudentSerializer(data, context={'request': request}, many=True)

#         return Response(serializer.data)

#     elif request.method == 'POST':
#         serializer = StudentSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(status=status.HTTP_201_CREATED)

#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['PUT', 'DELETE'])
# def students_detail(request, pk):
#     try:
#         student = Student.objects.get(pk=pk)
#     except Student.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)

#     if request.method == 'PUT':
#         serializer = StudentSerializer(student, data=request.data,context={'request': request})
#         if serializer.is_valid():
#             serializer.save()
#             return Response(status=status.HTTP_204_NO_CONTENT)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     elif request.method == 'DELETE':
#         student.delete()


@api_view(['GET', 'POST'])
def user_list(request):
    if request.method == 'GET':
        #data = User.objects.all()
        data = User.objects.values('name', 'id', 'created_at', 'is_admin')

        serializer = UserSerializer(data, context={'request': request}, many=True)

        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'DELETE'])
def user_detail(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = UserSerializer(user, context={'request': request})
        return Response(serializer.data)

    elif request.method == 'DELETE':
        user.delete()
        #hier fehlt eine ordentliche return Response()
        return Response(status=status.HTTP_200_OK)

@api_view(['GET', 'POST'])
def demo_list(request):
    if request.method == 'GET':
        data = Demo.objects.all()

        serializer = DemoSerializer(data, context={'request': request}, many=True)

        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = DemoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def demo_detail(request, pk):
    try:
        demo = Demo.objects.get(pk=pk)
    except Demo.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = DemoSerializer(demo, context={'request': request})
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = DemoSerializer(demo, data=request.data,context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        demo.delete()
        #hier fehlt eine ordentliche return Response()
        return Response(status=status.HTTP_200_OK)
        