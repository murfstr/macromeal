from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND
from .models import MealPlan
from .serializers import MealPlanSerializer

@api_view(['GET', 'POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def mealplans_list_create(request):
    if request.method == 'GET':
        mealplans = MealPlan.objects.filter(user=request.user)
        # Pass context to serializer
        serializer = MealPlanSerializer(mealplans, many=True, context={'request': request})
        return Response(serializer.data, status=HTTP_200_OK)
    
    elif request.method == 'POST':
        # Create a new meal plan for the authenticated user
        # Pass context so serializer can access request.user
        serializer = MealPlanSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def mealplans_detail(request, pk):
    try:
        mealplan = MealPlan.objects.get(pk=pk, user=request.user)
    except MealPlan.DoesNotExist:
        return Response({"detail": "Not found."}, status=HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        # Pass context
        serializer = MealPlanSerializer(mealplan, context={'request': request})
        return Response(serializer.data, status=HTTP_200_OK)

    elif request.method == 'PUT':
        # Pass context for updates
        serializer = MealPlanSerializer(mealplan, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_200_OK)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        mealplan.delete()
        return Response(status=HTTP_204_NO_CONTENT)
