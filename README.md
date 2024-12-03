# Maps à la Fouassier

Voici le projet *Maps à la Fouassier* de Logan LUCAS et de Thomas FOUASSIER.

## Comment lancer 😰
### - **Le back**
Le back est constitué :
- d'une solution (utile pour quelque chose, sans aucun doute)
- d'un seul et unique projet `RoutingServer`

Il suffit donc de lancer le projet `RoutingServer` à l'aide de votre outil favori, pour ma part il s'agit du CLI `dotnet`.
Pour ce faire, il faut :
- se déplacer dans le dossier `back/RoutingServer`
- exécuter la commande `dotnet run http://localhost:8000`

OU ALORS :
- se déplacer dans le dossier `back/RoutingServer`
- exécuter la commande `dotnet build -c Release`
- puis lancer le binaire créé dans `back/RoutingServer/bin/Release/net8.0` (sans oublier de passer un url d'écoute en paramètre)

Pour faire ceci en utilisant Microsoft™®© Visual™ Studio™, j'imagine que quelques clics gauches et quelques clics droits suffisent 
(en faisant bien attention à passer l'url d'écoute en paramètre).
  
### - **Le front**
Le front ne nécessite AUCUN gestionnaire de paquet ni environnement d'exécution JavaScript, donc la seule chose nécessaire pour le lancer est un web serveur quelconque tel que :
- darkhttpd
- lighttpd
- nginx (si vous êtes fou / déploiement)
- apache (si vous êtes fou / déploiement)

Sans oublier, évidemment, un superbe navigateur WEB pour le visualiser, que dis-je ? L'admirer !

Mes recommandations personnelles :
- Waterfox
- Firefox (faites un peu attention à vos données)
- Chromium (faites très attention à vos données)

A bannir :
- Chrome
- Edge
- Opera
- OperaGX
- Internet Explorer
