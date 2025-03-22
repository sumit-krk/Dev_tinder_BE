<!-- Dev tinder API's -->
 authRouter
- post/signup
- post/login
- post/logout

profileRouter
- get/profile/view
- patch/profile/edit

connectionRequestRouter
- Post /request/send/intersted/:userId
- Post /request/send/ignored/:userId
- Post /request/send/accepted/:userId
- Post /request/send/rejected/:userId

userRouter
- GET/user/connections
- GET/user/requests
- GET/user/feed