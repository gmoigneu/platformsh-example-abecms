# Nginx as a reverse proxy

You'll find here the default configuration to proxify Abecms through Nginx 1.*.

See [Nginx Proxy Documentation](http://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_pass) to go further.

```apacheconf
server {
    listen       80;
    root /path/to/your/abe/root/site;
    server_name  server.example.com;

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

We defined 2 locations, one to serve the static files `location /` and one for the Abecms editor `location /abe`

The location for abe cms editor will send the request to the Abecms nodejs backend with the directive `proxy_pass http://127.0.0.1:3000`.

We use `proxy_read_timeout` and `proxy_connect_timeout` to tell nginx to wait `300` secs for nodejs before send an error (connect or read).

## SSL
