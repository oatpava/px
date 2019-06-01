import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Message } from 'primeng/primeng'

declare var go: any;
@Component({
    selector: 'app-flow-chart',
    templateUrl: './flow-chart.component.html',
    styleUrls: ['./flow-chart.component.styl']
})
export class FlowChartComponent implements OnInit {
    @Input("fcDataArray") dataArray: any[] = []
    @Input("fcLinkDataArray") linkDataArray: any[] = []

    @ViewChild('myDiagramDiv') div;
    //@ViewChild('myKey') divKey;
    //colorTextcolorText: string = 'black';

    myDiagram: any
    //myKey: any
    msgs : Message[] = []
    constructor(
    ) {
    }

    ngOnInit() {
        const MAKE = go.GraphObject.make;
        const diagramDiv = this.div.nativeElement;
        this.myDiagram =
            MAKE(go.Diagram, diagramDiv,
                {
                    initialAutoScale: go.Diagram.Uniform,  // an initial automatic zoom-to-fit
                    initialContentAlignment: go.Spot.Center, // center Diagram contents
                    allowDrop: true, // must be true to accept drops from the Palette
                    isReadOnly: true,
                    "animationManager.duration": 800, // slightly longer than default (600ms) animation
                    "undoManager.isEnabled": true,  // enable undo & redo
                    "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
                    layout: MAKE(go.LayeredDigraphLayout, {
                        //angle: 0, nodeSpacing: 10, layerSpacing: 40, layerStyle: go.TreeLayout.LayerUniform,
                        layerSpacing: 80,//space left-right
                        columnSpacing: 5,//space up-down
                        setsPortSpots: false
                    })
                });

        this.myDiagram.nodeTemplate =
            MAKE(go.Node, "Auto",
                MAKE(go.Shape, "RoundedRectangle",
                    {
                        fill: "#EEE",
                        stroke: "#CCC",
                        // minWidth: 150,
                        // minHeight: 100,
                        // margin: 20
                    }),
                //, fromSpot: go.Spot.RightSide,toSpot: go.Spot.LeftSide  // coming out from right side // เส้นส่งครั้งเดียวกันให้เส้นแตกออกจากกัน
                //new go.Binding("location", "loc", go.Point.parse),
                MAKE(go.Picture,
                    // Pictures should normally have an explicit width and height.
                    // This picture has a red background, only visible when there is no source set
                    // or when the image is partially transparent.
                    { margin: new go.Margin(-20, 0, 0, 0), width: 23, height: 23, background: null },//"#DDD"
                    // Picture.source is data-bound to the "source" attribute of the model data
                    new go.Binding("source")),
                MAKE(go.TextBlock,
                    //"Default Text",  // the initial value for TextBlock.text
                    // Some room around the text, a larger font, and a white stroke:
                    //{ margin: 0, textAlign: "center", stroke: "#000", font: "normal 20px Sarabun" },//wrap: go.TextBlock.WrapFit
                    {
                        textAlign: "center",
                        margin: new go.Margin(30, 0, 0, 0),
                        font: "normal 14px Sarabun",
                        //minSize: new go.Size(100, 40),
                        //maxSize: new go.Size(200, 50),
                        //wrap: go.TextBlock.WrapFit,
                        //editable: true
                    },
                    // TextBlock.text is data-bound to the "name" attribute of the model data
                    new go.Binding("text", "name"))//,
                //            {
                //              toolTip:
                //                $(go.Adornment, "Auto",
                //                  $(go.Shape, { fill: "#FFFFCC" },
                //                    new go.Binding("visible", "info", function(i) { return i ? true : false; })),
                //                  $(go.TextBlock, { margin: 4 },
                //                    new go.Binding("text", "info"))
                //                )
                //            }
            );

        this.myDiagram.nodeTemplateMap.add("Comment",
            MAKE(go.Node, "Auto",
                new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                new go.Binding("stroke", "isSelected", function (s) { return s ? "dodgerblue" : "gray"; }).ofObject(),
                MAKE(go.Shape, "OffPageConnector",
                    {
                        portId: "",
                        fromLinkable: true,
                        fill: null,
                        stroke: "#CCC",
                        width: 100,
                        height: 50
                    }),
                MAKE(go.Picture,
                    {
                        margin: new go.Margin(-20, 0, 0, 0),
                        width: 23,
                        height: 23,
                        background: null
                    },
                    new go.Binding("source")),
                MAKE(go.TextBlock,
                    {
                        margin: new go.Margin(30, 0, 0, 0),
                        textAlign: "center",
                        //minSize: new go.Size(40, 40),
                        //wrap: go.TextBlock.WrapFit,
                        //editable: true,
                        font: "normal 11px Sarabun",
                    },
                    new go.Binding("text", "text").makeTwoWay())
                // no ports, because no links are allowed to connect with a comment
            ));


        this.myDiagram.linkTemplate =
            MAKE(go.Link,  // the whole link panel
                {
                    routing: go.Link.AvoidsNodes,
                    curve: go.Link.JumpOver,
                    corner: 5, toShortLength: 4,
                    relinkableFrom: true,
                    relinkableTo: true,
                    reshapable: true,
                    click: function (e, obj) {
                        var msg = obj.findObject("TXBX").caption;
                        //this.showMsg(msg)
                    }
                },
                MAKE(go.Shape,  // the link path shape
                    { isPanelMain: true, stroke: "#333", strokeWidth: 1, cursor: "pointer" }),
                MAKE(go.Shape,  // the arrowhead
                    { toArrow: "standard", stroke: null, fill: "#333" }),
                MAKE(go.Shape, "RoundedRectangle",  // the label shape of link
                    { fill: null, stroke: null }),//fill: "#FFF",
                MAKE(go.Panel, "Auto",  // the link label, normally not visible
                    { visible: true, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5 },
                    MAKE(go.TextBlock, "",  // the label
                        {
                            name: "TXBX",
                            textAlign: "center",
                            font: "normal 12px Sarabun",
                            stroke: "#777",
                            editable: false,
                            segmentOffset: new go.Point(0, 10)
                        },
                        new go.Binding("text", "text"),
                        new go.Binding("caption", "caption"))
                )
                // MAKE(go.TextBlock, "01/01/2560", 
                //     { 
                //         alignmentFocus: new go.Spot(1, 0.5, 3, 0),
                //         font: "normal 10px Sarabun",
                //         stroke: "#777" 
                //     }), new go.Binding("text", "text"),
                // MAKE(go.TextBlock, "11:11", 
                //     { 
                //         alignmentFocus: new go.Spot(0, 0.5, -3, 0),
                //         font: "normal 10px Sarabun",
                //         stroke: "#777" 
                //     }), new go.Binding("text", "text")
            );

        this.myDiagram.linkTemplateMap.add("Comment",
            MAKE(go.Link,  // the whole link panel
                {
                    routing: go.Link.AvoidsNodes,
                    curve: go.Link.JumpOver,
                    corner: 5, toShortLength: 4,
                    relinkableFrom: true,
                    relinkableTo: true,
                    reshapable: true,
                    click: function(e, obj) { 
                        var msg = obj.findObject("LTXBX").caption;
                        //this.showMsg(msg);
                    }
                },
                MAKE(go.Shape,  // the link path shape
                    { isPanelMain: true, stroke: "#AAA", strokeWidth: 1, cursor: "pointer" }),
                MAKE(go.Panel, "Auto",  // the link label, normally not visible
                    { visible: true, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5 },
                    MAKE(go.TextBlock, "",  // the label
                        {
                            name: "LTXBX",
                            textAlign: "center",
                            font: "normal 12px Sarabun",
                            stroke: "#777",
                            editable: false,
                            segmentOffset: new go.Point(0, 10)
                        },
                        new go.Binding("text", "text"),
                        new go.Binding("caption", "caption"))
                )
            )
        );

        this.myDiagram.linkTemplateMap.add("Relate",
        MAKE(go.Link,  // the whole link panel
          {
            routing: go.Link.AvoidsNodes,
            curve: go.Link.JumpOver,
            corner: 5, toShortLength: 4,
            relinkableFrom: true,
            relinkableTo: true,
            reshapable: true,
            click: function(e, obj) { 
                var msg = obj.findObject("RTXBX").caption;
                //this.showMsg(msg);
            }
          },
          MAKE(go.Shape,  // the link path shape
            { isPanelMain: true, stroke: "#657FFE", strokeWidth: 1, cursor: "pointer" }),
            MAKE(go.Panel, "Auto",  // the link label, normally not visible
            { visible: true, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5},
            MAKE(go.TextBlock, "",  // the label
                { name:"RTXBX",
                  textAlign: "center",
                  font: "normal 16px Sarabun",
                  stroke: "#777",
                  editable: false,
                  segmentOffset: new go.Point(0, 10)
                },
                new go.Binding("text", "text"),
                new go.Binding("caption", "caption"))
            )
        )
      );



        let model = go.GraphObject.make(go.GraphLinksModel)
        model.nodeDataArray = this.dataArray;
        model.linkDataArray = this.linkDataArray;
        this.myDiagram.model = model;
    }

    showMsg(msg: string) {
        this.msgs = []
        this.msgs.push({ severity: 'info', summary: 'รายละเอียด', detail: msg })
    }


}
