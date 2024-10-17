class MapView extends HTMLElement{
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.initializeMap();
    }

    render() {
        const mapDiv = document.createElement('div');
        mapDiv.id = 'map';
        mapDiv.style.height = '100vh';

        this.appendChild(mapDiv);
    }

    initializeMap() {
        var map = L.map('map').setView([51.505, -0.09], 13);

        const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        map.touchZoom.disable();
        map.doubleClickZoom.disable();
        //map.scrollWheelZoom.disable();
        map.boxZoom.disable();
        map.keyboard.disable();
        map.zoomControl.remove();

        var marker = L.marker([51.5, -0.09]).addTo(map);
        var marker2 = L.marker([51.0, -0.09]).addTo(map);

        marker.bindPopup("<b>Vous etes ici</b>").openPopup();

        function onMapClick(e) {
            console.log("You clicked the map at " + e.latlng);
            marker2.setLatLng(e.latlng);
        }
        map.on('click', onMapClick);
    }




}

customElements.define("map-view", MapView);