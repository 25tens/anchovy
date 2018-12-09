from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
#render library for returning views to the browser
from django.shortcuts import render
#decorator to make a function only accessible to registered users
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from .models import Post
#import the user library
from pusher import Pusher
#replace the xxx with your app_id, key and secret respectively
#instantate the pusher class
pusher = Pusher(app_id='566728', key='c90ed76284fa52b52a67', secret='5155ea5a56a0dfa0eb33', cluster='ap1',
  ssl=True)
# Create your views here.
def index(request):
    posts = Post.objects.filter(published_date__lte=timezone.now()).order_by('published_date')
    return render(request, 'index.html', {'posts': posts})
#login required to access this page. will redirect to admin login page.
@login_required(login_url='/admin/login/')
def chat(request):
    return render(request,"chat.html")
@csrf_exempt
def broadcast(request):
    pusher.trigger(u'a_channel', u'an_event', {u'name': request.user.username, u'message': request.POST['message']})
    return HttpResponse("done") 

