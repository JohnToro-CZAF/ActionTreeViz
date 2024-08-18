import { json } from "stream/consumers";
import { Treeviz } from "../src";
// load json data
import jsonData from './tree_states.json';

var data = [];
var simulated = []
var led_to_correct = []
for (let i = 0; i < jsonData.length; i++) {
  for (let j = 0; j < jsonData[i].length; j++) {
    if (i != 0 && j == 0) {
      continue;
    }
    if (j == jsonData[i].length - 1) {
      // the last state, blueing the chosen one
      for (let k = 0; k < jsonData[i][j].length; k++) {
        if (jsonData[i][j][k].correct) {
          led_to_correct.push(jsonData[i][j][k].id);
          jsonData[i][j][k].color = "#F6F193";
        }
        if (jsonData[i][j][k].chosen) {
          simulated.push(jsonData[i][j][k].id);
          jsonData[i][j][k].color = "orange";
        }
      }
    }
    for (let k = 0; k < jsonData[i][j].length; k++) {
      if (jsonData[i][j][k].prior != null) {
        jsonData[i][j][k].prior = jsonData[i][j][k].prior.toFixed(7);
      }
      if (jsonData[i][j][k].critic != null) {
        jsonData[i][j][k].critic = jsonData[i][j][k].critic.toFixed(7);
      }
      if (jsonData[i][j][k].ucb_score != null) {
        jsonData[i][j][k].ucb_score = jsonData[i][j][k].ucb_score.toFixed(7);
      }
      if (jsonData[i][j][k].score != null) {
        jsonData[i][j][k].score = jsonData[i][j][k].score.toFixed(7);
      }
      // jsonData[i][j][k].critic = jsonData[i][j][k].critic.toFixed(5);
      // jsonData[i][j][k].ucb_score = jsonData[i][j][k].ucb_score.toFixed(5);
      // jsonData[i][j][k].score = jsonData[i][j][k].score.toFixed(5);
      if (led_to_correct.includes(jsonData[i][j][k].id)) {
        jsonData[i][j][k].color = "#F6F193";
      }
      if (simulated.includes(jsonData[i][j][k].id)) {
        jsonData[i][j][k].color = "orange";
      }
    }
    data.push(jsonData[i][j]);
  }
}
for (let i = 0; i < data.length; i++) {
  if (data[i][0].parent == "null") {
    data[i][0].parent = null;
  }
}
console.log(data);

var myTree = Treeviz.create({
  data: data[0], // for Typescript projects only.
  htmlId: "tree",
  idKey: "id",
  hasFlatData: true,
  relationnalField: "parent",
  nodeWidth: 275,
  hasPan: true,
  hasZoom: true,
  nodeHeight: 400,
  mainAxisNodeSpacing: 2,
  isHorizontal: true,
  renderNode: function renderNode(node) {
    

    return (
      "<div class='box' style='cursor:pointer;height:auto" +
      "px; width:" +
      node.settings.nodeWidth +
      "px;display:flex;flex-direction:column;justify-content:center;align-items:left;margin: auto;background-color:" +
      node.data.color + ";border-radius:5px'>" +
        "<div style='margin-left:1em; margin-top:0.5em; margin-bottom: 0.5em; margin:right:1em'>" +
          "<div>" +
            // "<p>" +
            //   "<strong> Node id:" +node.data.id +" </strong>" +
            // "</p>" +
            // centering id
            "<div class='box' style='display:flex;justify-content:center;background-color: #180161; margin-right:1.5em'>" +
              "<i style='color:white'>" +node.data.id+ "</i>"+
            "</div>" +

            "<strong> Node text: </strong>" +
            "<details>" +
              "<summary>" + 
                "<i style='color:green'>" +node.data.text.slice(0, 200)+ "</i>"+
              "</summary>" +
                "<i style='color:green'>" +node.data.text.slice(200,-1)+ "</i>"+
            "</details>" +
        "</div>" +
        "<div style='margin-left:2em; margin-top:0.6em'>" +
          "<div>" +
            "<strong> Prior score &nbsp &#160: </strong>" + "<i style='color:red'>" +node.data.prior+ "</i>"+
          "</div>" +
          "<div>" +
            "<strong> Critics &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp: </strong>" + "<i style='color:red'>" +node.data.critic+ "</i>"+
          "</div>" + 
          "<div>" +
            "<strong> UCB score &nbsp &nbsp : </strong>" + "<i style='color:red'>" +node.data.ucb_score+ "</i>"+
          "</div>" + 
          "<div>" +
            "<strong> Score &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp : </strong>" + "<i style='color:red'>" +node.data.score+ "</i>"+
          "</div>" + 
          "<div>" +
            "<strong> Visited cnt &#160 &nbsp: </strong>" + "<i style='color:red'>" +node.data.visit_count+ "</i>"+ 
          "</div>" + 
          "<div>" +
            "<strong> Parent cnt &#160 &nbsp: </strong>" + "<i style='color:red'>" +node.data.parent_visit_count+ "</i>"+ 
          "</div>" + 
        "</div>" +
      "</div>"
    );
  },
  linkWidth: (node) => {
    return 4;
  },
  linkShape: "curve",
  linkColor: () => `#B0BEC5`,
  onNodeClick: (node) => {
    console.log(node.data);
  },
  onNodeMouseEnter: (node) => {
    console.log(node.data);
  },
});
data[0][0].color = "#B0BEC5";
myTree.refresh(data[0]);

var toggle = true;
var searchButton = document.querySelector("#search");
var cnt = 0;
// for loop to add data for each 3s
var lastL = null

searchButton?.addEventListener("click", function () {
  setInterval(function () {
    console.log("addButton clicked");
    var a;
    if (cnt % 2 == 0){
      a = cnt/2;
    } else {
      a = (cnt-1)/2;
    }
    if (a > data.length - 1) {
      return;
    }
    const l = data[a];
    if (cnt % 2 == 0) {
      for (let i = 0; i < l.length; i++) {
        if (l[i].color != "orange" && l[i].color != "#F6F193") {
          l[i].color = "#B0BEC5";
        }
      }
      myTree.refresh(l);
    }
    if (cnt % 2 == 1) {
      for (let i = 0; i < l.length; i++) {
        if (l[i].chosen) {
          if (l[i].color != "orange" && l[i].color != "#F6F193") {
            l[i].color = "yellow";
          }
        }     
      }
      lastL = l;
      myTree.refresh(l);
    }
    cnt += 1;
  }, 500);
  toggle = false;
});

var enableToggle = false;

var enableButton = document.querySelector("#enable");
enableButton?.addEventListener("click", function () {
  console.log("enableButton clicked");
  if (enableToggle == false) {
    const l = data[data.length - 1];
    for (let i = 0; i < l.length; i++) {
      if (l[i].color != "orange" && l[i].color != "#F6F193") {
        l[i].color = "#B0BEC5";
        if (l[i].done) {
          l[i].color = "#D9EDBF";
        }
      }
    }
    enableToggle = true;
  } else {
    var l = lastL;
    myTree.refresh(l);
    enableToggle = false;
  }
  
});