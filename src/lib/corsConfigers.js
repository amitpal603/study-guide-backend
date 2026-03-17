
 export const corsOptions = {
    origin : 'http://localhost:5173',
    methods : ['POST' , 'GET' , 'PUT' , 'DELETE','PATCH'],
    credentials : true,
    allowedHeaders : ['Content-Type' , 'Authorization']
}