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

Pour faire ceci en utilisant Microsoft®TM© Visual Studio, j'imagine que quelques clics gauches et quelques clics droits suffisent.
  
### - **Le front**
