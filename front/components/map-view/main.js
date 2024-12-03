class MapView extends HTMLElement {
    constructor() {
        super();
        this.map = null;
        this.routeLayer = null;
        this.markers = [];
    }

    connectedCallback() {
        this.style.position = 'absolute';
        this.style.width = '100vw';
        this.style.height = '100vh';
        this.style.zIndex = '-1';
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
        this.map = L.map('map').setView([47.7518, 7.33522], 13);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);

        this.map.touchZoom.disable();
        this.map.doubleClickZoom.disable();
        this.map.boxZoom.disable();
        this.map.keyboard.disable();
        this.map.zoomControl.remove();
    }

    displayItinerary(geometry, options = { color: 'blue', weight: 4 }) {
        if (!this.map) {
            console.error("Map is not initialized.");
            return;
        }

        const coordinates = polyline.decode(geometry);
        const latLngs = coordinates.map(coord => [coord[0], coord[1]]);

        if (this.routeLayer) {
            this.map.removeLayer(this.routeLayer);
        }

        this.routeLayer = L.polyline(latLngs, options).addTo(this.map);

        this.map.fitBounds(this.routeLayer.getBounds());
    }

    placeMarkers(coord1, coord2, coord3, coord4) {
        if (!this.map) {
            console.error("Map is not initialized.");
            return;
        }

        const coords = [coord1, coord2, coord3, coord4].map(coord => {
            const [lng, lat] = coord.split(',').map(Number);
            return [lat, lng];
        });

        const colors = ["red", "green"];

        // If markers aren't already here => create them
        if (this.markers.length === 0) {
            for (let i = 0; i < 4; i++) {
                const marker = L.marker(coords[i], { icon: this.createColoredIcon(colors[i < 2 ? 0 : 1]) }).addTo(this.map);
                this.markers.push(marker);
            }
        // Else => update their position
        } else {
            this.markers.forEach((marker, index) => {
                marker.setLatLng(coords[index]);
            });
        }
    }

    createColoredIcon(color) {
        return L.divIcon({
            className: "custom-div-icon",
            html: `<div style="background-color:${color};width:12px;height:12px;border-radius:50%;"></div>`,
            iconSize: [12, 12],
        });
    }
}

customElements.define("map-view", MapView);

export default MapView;
