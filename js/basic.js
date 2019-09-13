require([
    "esri/WebScene",
    "esri/layers/FeatureLayer",
    "esri/views/SceneView",
    "esri/widgets/Legend"
  ], function(WebScene, FeatureLayer, SceneView, Legend) {
    // Create view and load an existing webscene into it

    var webscene = new WebScene({
      portalItem: {
        // autocasts as new PortalItem()
        id: "ac98048566114b83807f8e0aec9332a4"
      }
    });

    var view = new SceneView({
      container: "viewDiv",
      map: webscene,
      qualityProfile: "high",
      environment: {
        lighting: {
          directShadowsEnabled: true,
          ambientOcclusionEnabled: true
        },
        atmosphere: {
          quality: "high"
        }
      }
    });

    // Create layer with the mountain peaks
    var peaks = new FeatureLayer({
      url:
        "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/AlpineSummits/FeatureServer",
      
     
      // Set a renderer that will show the points with icon symbols
      renderer: {
        type: "simple", // autocasts as new SimpleRenderer()
        symbol: {
          type: "point-3d", // autocasts as new PointSymbol3D()
          symbolLayers: [
            {
              type: "icon", // autocasts as new IconSymbol3DLayer()
              resource: {
                primitive: "circle"
              },
              material: {
                color: "black"
              },
              size: 4
            }
          ]
        }
      },
      outFields: ["*"],
      // Add labels with callouts of type line to the icons
      labelingInfo: [
        {
          // When using callouts on labels, "above-center" is the only allowed position
          labelPlacement: "above-center",
          labelExpressionInfo: {
            value: "{NAME} - {HOEHE}m"
          },
          symbol: {
            type: "label-3d", // autocasts as new LabelSymbol3D()
            symbolLayers: [
              {
                type: "text", // autocasts as new TextSymbol3DLayer()
                material: {
                  color: "black"
                },
                halo: {
                  color: [255, 255, 255, 0.7],
                  size: 2
                },
                size: 10
              }
            ],
            // Labels need a small vertical offset that will be used by the callout
            verticalOffset: {
              screenLength: 150,
              maxWorldLength: 2000,
              minWorldLength: 30
            },
            // The callout has to have a defined type (currently only line is possible)
            // The size, the color and the border color can be customized
            callout: {
              type: "line", // autocasts as new LineCallout3D()
              size: 0.5,
              color: [0, 0, 0],
              border: {
                color: [255, 255, 255, 0.7]
              }
            }
          }
        }
      ]
    });

  });
