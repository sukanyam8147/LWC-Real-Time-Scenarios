public class  OMDBController{
    //OMDB Means open movie database
    private static final string OMBD_API='http://www.omdbapi.com/?apikey=9c3cf537&s=';
    @AuraEnabled
    public static string getMovies(string title)
    {
        string endpoint=OMBD_API+title;
      Http h=new Http();
      HttpRequest req=new HttpRequest();
        req.setMethod('GET');
        req.setEndpoint(endpoint);
        HttpResponse res=h.send(req);
        if(res.getStatusCode()==200)
        {
            return res.getBody();
        }
       return '';
    }



}
