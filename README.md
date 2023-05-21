# ProjectProg4 - Share-a-meal

Dit is de README voor het project **Programmeren 4 - Share-a-meal**.

## Inleiding

Dit project is gemaakt als onderdeel van de cursus Programmeren 4 bij Avans Breda. Het doel van het project was om aan de slag te gaan met Javascript en een werkende API te maken. We hebben praktisch gewerkt met Node.js, een JavaScript-applicatie voor het maken van server-side toepassingen. In dit project heb ik een API gemaakt, vergelijkbaar met wat we hebben gezien en gebruikt bij Programmeren 3. Ik heb ook authenticatie toegevoegd, zodat gebruikers zich kunnen registreren en inloggen. Daarnaast heb ik de server daadwerkelijk online gezet, en dit proces is geautomatiseerd via een CI/CD-pipeline. Ik heb ook uitgebreid getest om de kwaliteit van de code aan te tonen, en Git gebruikt voor het beheren van de ontwikkeling van de programmacode.

## Installatie

Volg deze stappen om het project lokaal te installeren en uit te voeren:

1. Clone de repository naar je lokale machine:

2. Navigeer naar de projectmap:

3. Installeer de benodigde afhankelijkheden met behulp van npm:

4. Start de server:

## Gebruik/Endpoint Details

Zodra de server is gestart, kun je de API gebruiken via de volgende endpoints:

- `GET /api/info`: Geeft informatie over mij.
- `POST /api/user`: Hier kunnen gebruikers zich registreren door hun gegevens in te voeren.
- `GET /api/user`: Haalt alle gebruikers op (geauthenticeerd).
- `GET /api/user/profile`: Haalt het profiel van de ingelogde gebruiker op (geauthenticeerd).
- `GET /api/user/:id`: Haalt een specifieke gebruiker op basis van ID (geauthenticeerd).
- `PUT /api/user/:id`: Werkt een specifieke gebruiker bij op basis van ID (geauthenticeerd).
- `DELETE /api/user/:id`: Verwijdert een specifieke gebruiker op basis van ID (geauthenticeerd).
- `GET /api/meal`: Haalt alle maaltijden op.
- `POST /api/meal`: Voegt een nieuwe maaltijd toe (geauthenticeerd).
- `GET /api/meal/:id`: Haalt een specifieke maaltijd op basis van ID.
- `DELETE /api/meal/:id`: Verwijdert een specifieke maaltijd op basis van ID (geauthenticeerd).
- `POST /api/login`: Hier kunnen gebruikers inloggen met hun geregistreerde gegevens.

Zorg ervoor dat je de juiste verzoeken stuurt naar de juiste endpoints om de gewenste functionaliteit te bereiken.

## Authenticatie

Voor authenticatie maak ik gebruik van tokens. Gebruikers moeten zich registreren en inloggen om een geldig token te ontvangen, waarmee ze toegang hebben tot de beveiligde endpoints van de API.

## Online zetten op Railway

Om het project online te zetten op Railway, volgde ik de volgende stappen:

1. Eerst heb ik mijn GitHub-account gekoppeld aan mijn Railway-account. Dit stelde me in staat om eenvoudig de code van mijn GitHub-repository naar Railway te pushen en de implementatie te automatiseren.

2. Nadat ik wijzigingen had aangebracht in de code, voegde ik deze toe aan de Git-staging area met het volgende commando in de terminal: `git add .`

3. Vervolgens heb ik een commit gemaakt met een beschrijvende boodschap over de wijzigingen: `git commit -m "Wijzigingen toegevoegd voor online zetten op Railway"`

4. Daarna heb ik de code naar de `main`-branch van mijn GitHub-repository gepusht: `git push origin main`

5. Na het pushen van de code naar GitHub, ging ik naar mijn Railway-dashboard en selecteerde ik mijn projectrepository.

6. Na het koppelen van de repository, selecteerde ik de gewenste branch en klikte ik op "Deploy" om de code van mijn GitHub-repository naar Railway te implementeren.

7. Railway voerde automatisch de implementatie uit en bouwde mijn applicatie op. Ik kon de implementatiestatus volgen in het dashboard.

8. Nadat de implementatie was voltooid, kon ik mijn applicatie testen via Railway of via de gegenereerde URL.

Met deze stappen kon ik mijn project online zetten op Railway en de functionaliteit testen voordat het openbaar werd.

## Testen

Om de kwaliteit van de code aan te tonen, heb ik uitgebreide tests geschreven. Je kunt de tests uitvoeren door de volgende commando's uit te voeren in de terminal: `npm run dev`

## Contact

Voor vragen of suggesties kun je contact met mij opnemen via [dashyan.davit@gmail.com]. Je kunt ook een issue aanmaken in de GitHub-repository.

---

