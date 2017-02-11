# Nginx as a reverse proxy

You'll find here the default configuration to proxify Abecms through Nginx 1.*.

See [Nginx Proxy Documentation](http://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_pass) to go further.

```apacheconf
server {
    listen       80;
    root /path/to/your/abe/root/site;
    server_name  server.example.com;

    # Custom Error pages 404 and 502
    error_page 404 /404.html;
    error_page 502 /nginx_502.html;
    
    # Can't access Directly the page - only nginx can
    location  /404.html {
        internal;
    }

    # Can't access Directly the page - only nginx can 
     location  /nginx_502.html {
        internal;
    }

    location / {
    	index  index.html index.htm;
    }

    location /abe {
        proxy_pass http://127.0.0.1:3000;
        proxy_redirect off;
        proxy_set_header Host $host;
        proxy_read_timeout     300;
        proxy_connect_timeout  300;
        proxy_set_header X-Forwarded-For $remote_addr;
    }
}
```

### location

We defined 2 locations, one to serve the static files `location /` and one for the Abecms editor `location /abe`

### proxy

The location for abe cms editor will send the request to the Abecms nodejs backend with the directive `proxy_pass http://127.0.0.1:3000`.  
We use `proxy_read_timeout` and `proxy_connect_timeout` to tell nginx to wait `300` secs for nodejs before send an error (connect or read).

### error_page

We customized the 404 and 502 (bad gateway) error pages with 2 directives, `error_page 404 /404.html;` and `error_page 502 /nginx_502.html;`.  
If a page is not found on your Abecms site, you can now have your own 404 page.  
If your Abecms process is down nginx will return a 502 error. You can customize the 502 page. 

In this configuration these pages have to be in your `root /path/to/your/abe/root/site;`.
You can also customize the `location` of these errors pages. Adapt your Nginx config file.

## You're all set

The location for abe cms editor will send the request to the Abecms nodejs backend with the directive `proxy_pass http://127.0.0.1:3000`.


## SSL

> Comming soon in theater 
