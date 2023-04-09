<template>
  <div class="home">
    <div class="left-dragger-nav" id="left-dragger-nav">
    </div>
    <div id="container"></div>
  </div>
</template>

<script>
import { Graph, Addon, Shape } from "@antv/x6";
var { Rect, Circle } = Shape
const data = {
  "nodes": [
    {
      "id": "Data1",
      "x": 40,
      "y": 40,
      "width": 80,
      "height": 40,
      "label": "WorkFor",
      "dataRange" : "String",
    },
    {
      "id": "Class1",
      "x": 160,
      "y": 180,
      "width": 80,
      "height": 40,
      "shape": "ellipse",
      "label": "People"
    },
    {
      "id": "Class2",
      "x": 360,
      "y": 180,
      "width": 80,
      "height": 40,
      "shape": "ellipse",
      "label": "Location"
    },
    {
      "id": "Relation1",
      "x": 260,
      "y": 180,
      "width": 80,
      "height": 40,
      "shape": "polygon",
      "label": "LiveIn",
      "points": "100,0 200,40 100,80 0,40"
    },
    {
      "id": "Relation2",
      "x": 460,
      "y": 180,
      "width": 80,
      "height": 40,
      "shape": "polygon",
      "label": "LocIn",
      "points": "100,0 200,40 100,80 0,40"
    }
  ],
  "edges": [
    {
      "source": "Data1",
      "target": "Class1",
      "attrs": {
        "line": {
          "sourceMarker": "path",
          "targetMarker": "path"
        }
      }
    },
    {
      "source": "Class1",
      "target": "Relation1",
      "attrs": {
        "line": {
          "sourceMarker": "circle", 
          "targetMarker": "path"
        }
      }
    },
    {
      "source": "Relation1",
      "target": "Class2",
      "attrs": {
        "line": {
          "sourceMarker": "path", 
          "targetMarker": "block"
        }
      }
    },
    {
      "source": "Class2",
      "target": "Relation2",
      "attrs": {
        "line": {
          "sourceMarker": {
            "name": "ellipse",
            "rx": 5,
            "ry": 5,
            "fill": "white"
          },
          "targetMarker": "path"
        }
      }
    }
  ]
};
export default {
  name: "SchemaEdit",
  data() {
    GraphData: data
  },
  mounted() {
    const graph = new Graph({
      container: document.getElementById("container"),
      width: 800,
      height: 600,
      background: {
        color: "#fffbe6", // 设置画布背景颜色
      },
      grid: {
        size: 10, // 网格大小 10px
        visible: true, // 渲染网格背景
      },
    });
    graph.fromJSON(data);

    const stencil = new Addon.Stencil({
      target: graph,
      groups: [{ name: 'group1' }, { name: 'group2' }],
      collapsable: true,
      stencilGraphWidth: 200,//模板画布宽度
      stencilGraphHeight: 180,//模板画布高度

    });
    (document.getElementById("left-dragger-nav")).appendChild(stencil.container)

    const r = new Rect({
      width: 70,
      height: 40,
      attrs: {
        rect: { fill: '#31D0C6', stroke: '#4B4A67', strokeWidth: 6 },
        text: { text: 'rect', fill: 'white' },
      },
    })

    const c = new Circle({
      width: 60,
      height: 60,
      attrs: {
        circle: { fill: '#FE854F', strokeWidth: 6, stroke: '#4B4A67' },
        text: { text: 'ellipse', fill: 'white' },
      },
    })

    const c2 = new Circle({
      width: 60,
      height: 60,
      attrs: {
        circle: { fill: '#4B4A67', 'stroke-width': 6, stroke: '#FE854F' },
        text: { text: 'ellipse', fill: 'white' },
      },
    })

    const r2 = new Rect({
      width: 70,
      height: 40,
      attrs: {
        rect: { fill: '#4B4A67', stroke: '#31D0C6', strokeWidth: 6 },
        text: { text: 'rect', fill: 'white' },
      },
    })

    const r3 = new Rect({
      width: 70,
      height: 40,
      attrs: {
        rect: { fill: '#31D0C6', stroke: '#4B4A67', strokeWidth: 6 },
        text: { text: 'rect', fill: 'white' },
      },
    })

    const c3 = new Circle({
      width: 60,
      height: 60,
      attrs: {
        circle: { fill: '#FE854F', strokeWidth: 6, stroke: '#4B4A67' },
        text: { text: 'ellipse', fill: 'white' },
      },
    })



    //向分组模板画布下添加拖动的元素，记住一定要在创建Stencil的时候添加模板画布的宽度和高度，不然将拖动元素添加进去不会显示
    stencil.load([r, c, c2, r2.clone()], 'group1')
    stencil.load([c2.clone(), r2, r3, c3], 'group2')



  }
}
</script>
