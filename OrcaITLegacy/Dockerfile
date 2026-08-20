FROM php:8.2-apache

RUN a2enmod rewrite headers headers

WORKDIR /var/www/html

COPY OrcaITLegacy/includes/ ./includes/
COPY OrcaITLegacy/public/ ./public/
COPY OrcaITLegacy/apache-vhost.conf /etc/apache2/sites-available/000-default.conf

COPY OrcaITWeb/public/orca-logo.png \
     OrcaITWeb/public/favicon.png \
     OrcaITWeb/public/orca-about-team.png \
     OrcaITWeb/public/orca-business-it-team.png \
     OrcaITWeb/public/orca-what-we-do-team.png \
     OrcaITWeb/public/orca-team.png \
     OrcaITWeb/public/hero-van-street.png \
     ./public/assets/

RUN mkdir -p /var/www/html/data \
 && chown -R www-data:www-data /var/www/html/data /var/www/html/public

EXPOSE 80
