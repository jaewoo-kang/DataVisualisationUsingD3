<h1>Mapping Population Dynamics and Geographic Insights Using D3</h1>


**1. Abstract**

This project is a web application that visualizes various datasets through fix charts, including global population density, population trends by country, birth rate trends by country, a Voronoi diagram of U.S. airports, Walmart’s growth over time, and health-adjusted life expectancy (HALE) by country. The project is built using HTML, CSS, JavaScript, D3.js, and TopoJSON, and d3-geo-voronoi, the application combines geographic and statistical visualization techniques to create an interactive, user-friendly platform for exploring data trends.



**2. Technology Stack**

•	HTML5: Defines the basic structure of the webpage.

•	CSS3: Handles styling and layout.

•	JavaScript: Manages data visualization using D3.js.

•	D3.js: A primary library used for creating various charts and geographic visualizations.

•	Nodemon: A development tool that automatically restarts the server when file changes are detected. This streamlines the development process by reducing the need for manual restarts.

•	TopoJSON: Used for processing geographical data to create map visualizations.

•	d3-geo-voronoi: Utilized to draw Voronoi diagrams.



**3. How to Use**

1. Install dependencies by running:
```
npm install
```

2. Install nodemon using npm
- global install:
```
npm install -g nodemon
```

- local install:
```
npm install --save-dev nodemon
```

3. Start the application using Nodemon:
```
nodemon index.js
```

Nodemon will monitor your project files and automatically restart the server whenever you make changes, enabling a smoother development experience.