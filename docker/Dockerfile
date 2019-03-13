FROM httpd:2.4.35-alpine

ADD https://github.com/cghislai/authenticator-admin-front/releases/download/1.0.2-rc.1/authenticator-admin-front-1.0.2-rc.1.tgz \
    /opt/deployment/authenticator-admin-front.tgz
COPY scripts/* /opt/
COPY conf/httpd.conf /usr/local/apache2/conf/httpd.conf
COPY conf/ssl.conf /usr/local/apache2/conf/extra/httpd-ssl.conf

ENTRYPOINT ["/opt/entrypoint.sh"]
CMD ["httpd-foreground"]
