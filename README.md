jaggery-pipe
============

Jaggery-Pipe is a connect like middleware stack for the Jaggery Framework.It is HEAVILY inspired by the way connect does things! :)

Contents
========
1. Installation
2. Usage
3. Plug-ins

Installation
============
Drop the jaggery-pipe module into the PRODUCT_HOME/modules/ directory to get started working with the Pipe.The plug-ins folder has a set of plug-ins that offer commonly required functionality from a web application.


Usage
=====

Getting started with the pipe is easy as requiring the pipe module :)

```javascript
  var pipe=require('pipe');
  var router=require('router');
  
  pipe.plug(router);

```

The above code states that the router plug-in should be used for all requests. Lets get a bit more fancy and apply a plug-in to a specific route.

```javascript
  var common=require('pipe-common');
  
  pipe.plug('/friends'common.logger);
```

The common.logger is a plug-in which simply logs the request to the console.The above piece of code would log any request that contains the '/friend' component.



Plug-ins
========
Jaggery-Pipe ships with a few default plugins that allow you to get up and running with a basic application in little time as possible. This section will explore a few of the plugins that perform common application logic.


Router
------
The router plug-in allows routes to be defined in a simple and clean manner.

### Basic Usage

**fe.jag**:
```javascript
   var router=require('router');
   router.app.get('/hello',function(){
       print('Hello World!');    
  });

```

If you navigate to ; yourapp/hello you will be greeted by 'Hello World!'.

**fe.jag**:
```javascript
  router.app.get('/hello/:user',function(req){
    print('Hello '+req._params.user+'. How are you?');
  });
```

If you navigate to; yourapp/hello/sam you will be greeted by 'Hello sam. How are you?'

Although this is perfectly fine for smaller apps,having callbacks declared with routes quickly becomes unwiedly (and ugly!). Therefore to improve readability the router plug-in allows you to define routes in js files.

**hello.js**:
```javascript
   var sayHello=function(req){
      print('Hello '+req._params.user+'. How are you?');
   };
```

**fe.jag**:
```javascript
  var myHelloLogic=require('hello.js');
  
  router.app.get('/hello/:user',myHelloLogic.sayHello);
```

Much more readable,right? :)

### Using a renderer

In addition to using the print statement,the router plug-in can use a renderer to respond to a request. The router plug-in comes with a sample renderer which will send a json response.
 
```javascript
  var sayHelloInJSON=function(req,res){
     var data={
       msg: 'Hello, I am a json object'
     };
     
     res._render(data);
  }
```
You can also set your own renderer per request method type;

```javascript
  router.app.utils('get-renderer',function(data){
      print('This is a custom renderer : '+stringify(data));
  });
```

Similarly you can also set renderers for other methods by using:
* put-renderer
* delete-renderer
* post-renderer



Writing a plug-in
=================
Writing a new plug-in is easy as defining a simple function callback.The Jaggery-Pipe requires a method named handle which is used to access the functionality of your plug-in as a request is serviced.




