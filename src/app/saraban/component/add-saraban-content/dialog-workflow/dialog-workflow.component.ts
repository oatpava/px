import { Component, OnInit, ViewChild } from '@angular/core';
import { Message } from 'primeng/primeng'

import { WorkflowService } from '../../../../mwp/service/workflow.service'

import { Workflow } from '../../../../mwp/model/workflow.model'
import { WorkflowNode } from '../../../../mwp/model/workflowNode.model'
import { WorkflowLink } from '../../../../mwp/model/workflowLink.model'
import { WorkflowModel_groupNodeFlow } from '../../../../mwp/model/WorkflowModel_groupNodeFlow.model'
import { WorkflowModel_groupLinkFlow } from '../../../../mwp/model/WorkflowModel_groupLinkFlow.model'

declare var go: any;
@Component({
  selector: 'app-dialog-workflow',
  templateUrl: './dialog-workflow.component.html',
  styleUrls: ['./dialog-workflow.component.styl'],
  providers: [WorkflowService]
})
export class DialogWorkflowComponent implements OnInit {
  @ViewChild('myDiagramDiv') div
  myDiagram: any
  documentId: number
  msgs: Message[] = []
  contentTitle: string

  constructor(
    public _workflowService: WorkflowService
  ) { }

  ngOnInit() {
    this.getWorkflowImage(this.documentId)
  }

  getWorkflowImage(linkId: number) {
    this._workflowService
      .listForImage(linkId)
      .subscribe(response => {
        console.log('=====================', response.workflowModel_groupNodeFlow)
        console.log('=====================', response.workflowModel_groupLinkFlow)
        this.draw(response.workflowModel_groupNodeFlow, response.workflowModel_groupLinkFlow)
      })
  }

  test() {
    let n: any[] = [
      {key: '1', name: '1', category: ""},
      {key: '1N', name: '1new', category: "comment"},
      {key: '2', name: '1', category: ""},
      {key: '2R', name: '2register', category: "comment"},
      {key: '3', name: '1', category: ""},
      {key: '3R', name: '3register', category: "comment"},
      {key: '4', name: 'xxx', category: ""},

    ]

    let l: any[] = [
      {from: '1N', to: '1', category: "comment"},
      {from: '2R', to: '2', category: "comment"}, 
      {from: '3R', to: '3', category: "comment"},
      {from: '2', to: '4', category: ""},

    ]
    this.draw(n, l)


  }

  draw(node: any[], link: any[]) {
    const MAKE = go.GraphObject.make;
    const diagramDiv = this.div.nativeElement;
    this.myDiagram =
      MAKE(go.Diagram, diagramDiv,
        {
          initialAutoScale: go.Diagram.Uniform,             // an initial automatic zoom-to-fit
          initialContentAlignment: go.Spot.Center,          // center Diagram contents
          allowDrop: true,                                  // must be true to accept drops from the Palette
          isReadOnly: true,
          "animationManager.duration": 800,                 // slightly longer than default (600ms) animation
          "undoManager.isEnabled": true,                    // enable undo & redo
          "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
          layout: MAKE(go.LayeredDigraphLayout, {
            //angle: 0, nodeSpacing: 10, layerSpacing: 40, layerStyle: go.TreeLayout.LayerUniform,
            layerSpacing: 80,                               //space left-right
            columnSpacing: 10,                              //space up-down
            setsPortSpots: false
          })
        });

    this.myDiagram.nodeTemplate =
      MAKE(go.Node, "Auto",
        MAKE(go.Shape, "RoundedRectangle", {
          fill: null,
          stroke: null,
          // minWidth: 150,
          // minHeight: 100,
          // margin: 20
          // fromSpot: go.Spot.RightSide,
          // toSpot: go.Spot.LeftSide
        }),
        MAKE(go.Picture, {
          margin: new go.Margin(-20, 0, 0, 0),
          width: 23,
          height: 23,
          background: null
        },
          new go.Binding("source")),
        MAKE(go.TextBlock, {
          textAlign: "center",
          margin: new go.Margin(30, 0, 0, 0),
          font: "normal 14px Sarabun"
          //,isStrikethrough: true
        },
          new go.Binding("text", "name"),
          new go.Binding("isStrikethrough", "isStrikethrough"))
        // , {)
        //   toolTip:
        //     MAKE(go.Adornment, "Auto",
        //       MAKE(go.Shape, { fill: "#FFFFCC" },
        //         new go.Binding("visible", "info", function (i) { return i ? true : false; })),
        //       MAKE(go.TextBlock, { margin: 4 },
        //         new go.Binding("text", "info"))
        //     )
        // }
        , {
          toolTip:
            MAKE(go.Adornment, "Auto",
              MAKE(go.Shape, { fill: "#FFFFCC" },
                new go.Binding("visible", "info", function (i) { return i ? true : false; })),
              MAKE(go.TextBlock, { margin: 4 },
                new go.Binding("text", "text"))
            )
        }
      );

    this.myDiagram.nodeTemplateMap.add("Comment",
      MAKE(go.Node, "Auto",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        MAKE(go.Shape, "Rectangle", {
          portId: "",
          fromLinkable: true,
          fill: null,
          stroke: null,
          //width: 100,
          height: 50
        }),
        MAKE(go.Picture, {
          margin: new go.Margin(-20, 0, 0, 0),
          width: 23,
          height: 23,
          background: null
        },
          new go.Binding("source")),
        MAKE(go.TextBlock, {
          name: "txt",
          margin: new go.Margin(30, 0, 0, 0),
          textAlign: "left",
          font: "normal 12px Sarabun",
        },
          new go.Binding("text", "name").makeTwoWay())
        , {
          toolTip:
            MAKE(go.Adornment, "Auto",
              MAKE(go.Shape, { fill: "#FFFFCC" },
                new go.Binding("visible", "info", function (i) { return i ? true : false; })),
              MAKE(go.TextBlock, { margin: 4 },
                new go.Binding("text", "text"))
            )
        }
      ));


    this.myDiagram.linkTemplate =
      MAKE(go.Link, {
        routing: go.Link.AvoidsNodes,
        curve: go.Link.JumpOver,
        corner: 5,
        toShortLength: 4,
        relinkableFrom: true,
        relinkableTo: true,
        reshapable: true,
        click: function (e, obj) {
          var msg = obj.findObject("TXBX").caption;
          //this.showMsg(msg)
        }
      },
        MAKE(go.Shape, {// the link path shape
          isPanelMain: true,
          stroke: "#333", strokeWidth: 1,
          cursor: "pointer"
        }),
        MAKE(go.Shape, {// the arrowhead
          toArrow: "standard",
          stroke: null,
          fill: "#333"
        }),
        MAKE(go.Shape, "RoundedRectangle", { // the label shape of link
          fill: null,
          stroke: null
        }),
        MAKE(go.Panel, "Auto", { // the link label, normally not visible
          visible: true,
          name: "LABEL",
          segmentIndex: 2,
          segmentFraction: 0.5
        },
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
          click: function (e, obj) {
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
          click: function (e, obj) {
            var msg = obj.findObject("RTXBX").caption;
            //this.showMsg(msg);
          }
        },
        MAKE(go.Shape,  // the link path shape
          { isPanelMain: true, stroke: "#657FFE", strokeWidth: 1, cursor: "pointer" }),
        MAKE(go.Panel, "Auto",  // the link label, normally not visible
          { visible: true, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5 },
          MAKE(go.TextBlock, "",  // the label
            {
              name: "RTXBX",
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

    model.nodeDataArray = node
    model.linkDataArray = link
    this.myDiagram.model = model
  }

  showMsg(msg: string) {
    this.msgs = []
    this.msgs.push({ severity: 'info', summary: 'รายละเอียด', detail: msg })
  }

}
