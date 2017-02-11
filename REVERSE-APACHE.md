# Apache as a reverse proxy

## Using mod_proxy

You'll find here the default configuration to proxify Abecms through apache 2.*.
First you need to activate 2 modules `proxy_module` and `proxy_http_module` in Apache config file. If you want to use https you need one more module `proxy_connect_module`.

See [Apache Proxy Documentation](http://docs.locust.io/en/latest/installation.html) to go further.

Then you can configure your vhost for your Abecms.

```apacheconf
<VirtualHost *:80>
    ServerName	server.example.com
    DocumentRoot	/path/to/your/abe/root/site
    ErrorDocument 404 /404.html
    ErrorDocument 503 /apache_503.html
    ProxyPreserveHost	On
    AllowEncodedSlashes	On
    ProxyRequests	Off
    ProxyPassMatch ^/abe(.*) http://localhost:3000/abe$1 nocanon retry=0
    <Proxy *>
        Options +Includes
        AddDefaultCharset off
    </Proxy>
</VirtualHost>
```
### ProxyPreserveHost

You should turn `On` this directive in case of multiple Abecms on the same server. This directive will pass the Host: header to the proxied host instead of the hostname specified in the ProxyPass line. 

### ErrorDocument

We customized the 404 and 503 - `Service Unavailable` - error pages with 2 directives, `ErrorDocument 404 /404.html` and `ErrorDocument 503 /apache_503.html`.  
If a page is not found on your Abecms site, you can now have your own 404 page.  
If your abecms process is down Apache will return a 503 error. You can also customize the 503 page.

In this configuration these pages have to be in your `DocumentRoot    /path/to/your/abe/root/site`.
You can customize this location.


## Using mod_rewrite

There is another way to do so and it's not the Darsk Side way 😄. 

With apache `rewrite_module` activated you can put an `.htaccess` file in the `site` directory.

```apacheconf
RewriteEngine On
RewriteRule ^abe(.*) http://localhost:3000/abe$1 [P,L]
```

## You're all set

With those configurations you can reach your static site at `http://server.example.com` and your Abecms at `http://server.example.com/abe/editor`.

## SSL

> Comming soon in theater 