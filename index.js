// source: https://github.com/OpenSlides/OpenSlides/blob/f4f8b8422f9b3fbab58e35ac3f8f870d35813b7d/client/src/app/core/ui-services/html-to-pdf.service.ts
// and https://github.com/bpampuch/pdfmake/issues/205

/**
  To use it:
  import htmlToPdfMake from 'html-to-pdfmake.js'
  htmlToPdfMake('<b>my bold text</b>');
*/

/**
 * Transform HTML code to a PdfMake object
 * @param  {String} htmlText The HTML code to transform
 * @param  {Object} [options]
 *   @param  {Object} [defaultStyles] An object with the default styles for each elements
 *   @param  {Boolean} [tableAutoSize=false] It permits to use the width/height defined in styles for a table's cells and rows
 *   @param  {Object} [window] The `window` object (required for NodeJS server side use)
 * @return {Object} it returns a PdfMake object
 *
 * @example
 * // Some styles are applied by defaults for the supported HTML elements
 * // but you can pass your own styles if you prefer
 * htmlToPdfMake('<div><h1>My Title</h1><p>My paragraph</p></div>');
 *
 * // If you want to overwrite the default styles, e.g. you want <li> to not have a margin-left, and links to be 'purple' and not 'blue', and links without 'underline'
 * htmlToPdfMake('<ul><li>this is <a href="...">a link</a></li><li>another item</li></ul>', {
 *   defaultStyles:{
 *     a:{
 *       color:'purple',
 *       decoration:null
 *     },
 *     li:null
 *   }
 * });
 */
//var util = require("util"); // to debug


module.exports = function (options) {
  this.imageThumbnail = (options && options.imageThumbnail ? options.imageThumbnail : null);
  this.fetch = (options && options.fetch ? options.fetch : null);
  this.base64cache = (options && options.base64cache ? options.base64cache : {});
  this.filebase64default='data:image/jpeg;base64,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';
  this.filebase64 = (options && options.filebase64 ? options.filebase64 : this.filebase64default);
  this.ttl = (options && options.ttl ? options.ttl : 1000*60*15);
  this.ttlempty = (options && options.ttlempty ? options.ttlempty : 1000*60*5);
  this.depure = (ttl, cache) => { // delete according to ttl
    try{
      if(ttl) {
        if(Number.isNaN(ttl)){
          if(typeof(ttl)==='object') {
            cache = ttl;
            ttl = null;
          }
        }
      }
      if(cache) {
        this.base64cache = cache;
      }
      var t = new Date().getTime();
      if(ttl) {
        Object.keys(this.base64cache).forEach(key => {
          if(!this.base64cache[key].created || !this.base64cache[key].ttl || (this.base64cache[key].created < t-ttl)) {
            delete this.base64cache[key];
          }
        });
      } else {
        Object.keys(this.base64cache).forEach(key => {
          if(!this.base64cache[key].created || !this.base64cache[key].ttl || (this.base64cache[key].created < t-this.base64cache[key].ttl)) {
            delete this.base64cache[key];
          }
        });
      }
    }catch(e){
      console.log(e);
    }
  }
  this.empty = (cache) =>{ // delete all
    Object.keys(this.base64cache).forEach(key =>{
      if(this.base64cache[key].created && this.base64cache[key].created < t) {
        delete this.base64cache[key];
      }
    });
    if(cache){
      this.base64cache = cache;
    }
    Object.keys(this.base64cache).forEach(key =>{
      if(this.base64cache[key].created && this.base64cache[key].created < t) {
        delete this.base64cache[key];
      }
    });
  }
  this.create = (htmlText, options) =>{
  return new Promise(async (resolve,reject) => {
    var imageThumbnail = (options && options.imageThumbnail ? options.imageThumbnail : this.imageThumbnail);
    var fetch = (options && options.fetch ? options.fetch : this.fetch);
    var base64cache = (options && options.base64cache ? options.base64cache : this.base64cache);
    var wndw = (options && options.window ? options.window : window);
    var tableAutoSize = (options && typeof options.tableAutoSize === "boolean" ? options.tableAutoSize : false);
    var ttl = (options && options.ttl ? options.ttl : this.ttl);
    var ttlempty = (options && options.ttlempty ? options.ttlempty : this.ttlempty);
    filebase64 = (options && options.filebase64 ? options.filebase64 :this.filebase64);


    var fontSizes = (options && Array.isArray(options.fontSizes) ? options.fontSizes : [10, 14, 16, 18, 20, 24, 28]);
    // set default styles
    var defaultStyles = {
      b: {bold:true},
      strong: {bold:true},
      u: {decoration:'underline'},
      del: {decoration:'lineThrough'},
      s: {decoration: 'lineThrough'},
      em: {italics:true},
      i: {italics:true},
      h1: {fontSize:24, bold:true, marginBottom:5},
      h2: {fontSize:22, bold:true, marginBottom:5},
      h3: {fontSize:20, bold:true, marginBottom:5},
      h4: {fontSize:18, bold:true, marginBottom:5},
      h5: {fontSize:16, bold:true, marginBottom:5},
      h6: {fontSize:14, bold:true, marginBottom:5},
      a: {color:'blue', decoration:'underline'},
      strike: {decoration: 'lineThrough'},
      p: {margin:[0, 5, 0, 10]},
      ul: {marginBottom:5,marginLeft:5},
      table: {marginBottom:5},
      th: {bold:true, fillColor:'#EEEEEE'}
    }

    /**
     * Permit to change the default styles based on the options
     */
    function changeDefaultStyles () {
      for (var keyStyle in options.defaultStyles) {
        if (defaultStyles.hasOwnProperty(keyStyle)) {
          // if we want to remove a default style
          if (options.defaultStyles.hasOwnProperty(keyStyle) && !options.defaultStyles[keyStyle]) {
            delete defaultStyles[keyStyle];
          } else {
            for (var k in options.defaultStyles[keyStyle]) {
              // if we want to delete a specific property
              if (options.defaultStyles[keyStyle][k] === '') delete defaultStyles[keyStyle][k];
              else defaultStyles[keyStyle][k] = options.defaultStyles[keyStyle][k];
            }
          }
        } else {
          // if we add default styles
          defaultStyles[keyStyle] = {}
          for (var ks in options.defaultStyles[keyStyle]) {
            defaultStyles[keyStyle][ks] = options.defaultStyles[keyStyle][ks];
          }
        }
      }
    }

    if (options && options.defaultStyles) {
      changeDefaultStyles();
    }

    /**
     * Takes an HTML string, converts to HTML using a DOM parser and recursivly parses
     * the content into pdfmake compatible doc definition
     *
     * @param htmlText the html text to translate as string
     * @returns pdfmake doc definition as object
     */
    var convertHtml = async function(htmlText) {
      return new Promise(async (resolve,reject) => {
        var parser = new wndw.DOMParser();
        var parsedHtml = parser.parseFromString(htmlText, 'text/html');
        parseElement(parsedHtml.body, []).then(docDef=>{
          resolve(docDef.stack || docDef.text);
        }).catch(e=>{
          resolve({});
        });
      });
    }

    /**
     * Converts a single HTML element to pdfmake, calls itself recursively for child html elements
     *
     * @param element can be an HTML element (<p>) or plain text ("Hello World")
     * @param parentNode the parent node for the current element
     * @param parents Array of node names of all the parents for the element
     * @returns the doc def to the given element in consideration to the given paragraph and styles
     */
    var parseElement = async function(element, parents) {
      return new Promise(async (resolve,reject) => {
        var nodeName = element.nodeName.toUpperCase();
        var nodeNameLowerCase = nodeName.toLowerCase();
        var ret = {text:[]};
        var text, needStack=false;
        var dataset, i, key;

        // ignore some HTML tags
        if (['COLGROUP','COL'].indexOf(nodeName) > -1) return '';
        switch(element.nodeType) {
          case 3: { // TEXT_NODE
            if (element.textContent) {
              text = element.textContent;
              // check if we have 'white-space' in the parent's style
              var styleParentTextNode = parseStyle(parents[parents.length-1], true);
              var hasWhiteSpace = false;
              for (i=0; i<styleParentTextNode.length; i++) {
                if (styleParentTextNode[i].key === "preserveLeadingSpaces") {
                  hasWhiteSpace=styleParentTextNode[i].value;
                  break;
                }
              }
              // if no 'white-space' style, then remove blanks
              if (!hasWhiteSpace) text = element.textContent.replace(/\n(\s+)?/g, "");
              if (options && typeof options.replaceText === "function") text = options.replaceText(text, parents);

              // for table, thead, tbody, tfoot, tr, ul, ol: remove all empty space
              if (['TABLE','THEAD','TBODY','TFOOT','TR','UL','OL'].indexOf(parents[parents.length-1].nodeName) > -1) text = text.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
              if (text) {
                ret = {'text':text};
                ret = applyStyle({ret:ret, parents:parents});
                resolve(ret);
              }
            }

            resolve('');
          }
          case 1: { // ELEMENT_NODE
            ret.nodeName = nodeName;
            parents.push(element);
            if(!ret.text){
              ret.text = [];
            }
            if (element.childNodes && element.childNodes.length>0) {
              for(let x=0; x< element.childNodes.length;x++) {
                var child = element.childNodes[x];
                try{
                  var res = await parseElement(child, parents);
                  if (res) {
                    if (Array.isArray(res.text) && res.text.length===0) res.text='';
                    ret.text.push(res);
                  }
                }catch(e){
                }
              }
              needStack = searchForStack(ret);
              if (needStack) {
                ret.stack = ret.text.slice(0);
                // delete ret.text;
              } else {
                // apply all the inhirent classes and styles from the parents
                ret = applyStyle({ret:ret, parents:parents});
              }
            }
            parents.pop();

            switch(nodeName) {
              case "TABLE":{
                var rowIndex, cellIndex;
                // the format for the table is table.body[[], [], …]
                ret.table = {body:[]};
                var tbodies = (ret.stack || ret.text);
                if (Array.isArray(tbodies)) {
                  rowIndex = 0;
                  // Array with All Rows including THEAD
                  var allRows = [];
                  // for each THEAD / TBODY
                  tbodies.forEach(function(tbody) {
                    // for each row
                    var rows = (tbody.stack || tbody.text);
                    if (Array.isArray(rows)) {
                      // Add rows to allRows
                      allRows = allRows.concat(rows);
                      rows.forEach(function(row) {
                        var cells = (row.stack || row.text);
                        // for each cell
                        if (Array.isArray(cells)) {
                          cellIndex = 0;
                          ret.table.body[rowIndex] = [];
                          cells.forEach(function(cell) {
                            ret.table.body[rowIndex].push(cell);

                            // do we have a colSpan?
                            // if yes, insert empty cells due to colspan
                            if (cell.colSpan) {
                              i = cell.colSpan;
                              // do we have a rowSpan in addition of the colSpan?
                              setRowSpan({rows:allRows, cell:cell, rowIndex:rowIndex, cellIndex:cellIndex});
                              while (--i > 0) {
                                ret.table.body[rowIndex].push({text:''});
                                // keep adding empty cell due to rowspan
                                setRowSpan({rows:allRows, cell:cell, rowIndex:rowIndex, cellIndex:cellIndex});
                                cellIndex++;
                              }
                            } else {
                              // do we have a rowSpan ?
                              setRowSpan({rows:allRows, cell:cell, rowIndex:rowIndex, cellIndex:cellIndex});
                            }

                            cellIndex++;
                          });
                          rowIndex++;
                        }
                    });
                    }
                  });
                }

                delete ret.stack;
                delete ret.text;
                // apply all the inhirent classes and styles from the parents, or for the current element
                ret = applyStyle({ret:ret, parents:parents.concat([element])});

                // if option tableAutoSize, then we try to apply the correct width/height on the table
                if (tableAutoSize) {
                  var cellsWidths = [];
                  var cellsHeights = [];
                  var tableWidths = [];
                  var tableHeights = [];

                  ret.table.body.forEach(function(row, rowIndex) {
                    cellsWidths.push([]);
                    cellsHeights.push([]);
                    row.forEach(function(cell) {
                      // we want to remember the different sizes
                      var width = typeof cell.width !== 'undefined' ? cell.width : 'auto';
                      var height = typeof cell.height !== 'undefined' ? cell.height : 'auto';
                      // check if we have colspan or rowspan
                      // if yes, and if width/height is a number, we divide by the col/rowspan, otherwise we use 'auto'
                      if (width !== 'auto' && cell.colSpan) {
                        if (!isNaN(width)) width /= cell.colSpan;
                        else width = 'auto';
                      }
                      if (height !== 'auto' && cell.rowSpan) {
                        if (!isNaN(height)) height /= cell.colSpan;
                        else height = 'auto';
                      }
                      cellsWidths[rowIndex].push(width);
                      cellsHeights[rowIndex].push(height);
                    });
                  });

                  // determine the max width for each cell
                  cellsWidths.forEach(function(row) {
                    row.forEach(function(cellWidth, cellIndex) {
                      var type = typeof tableWidths[cellIndex];
                      if (type === "undefined" || (cellWidth !== 'auto' && type === "number" && cellWidth > tableWidths[cellIndex]) || (cellWidth !== 'auto' && tableWidths[cellIndex] === 'auto')) {
                        tableWidths[cellIndex] = cellWidth;
                      }
                    });
                  });
                  // determine the max height for each row
                  cellsHeights.forEach(function(row, rowIndex) {
                    row.forEach(function(cellHeight) {
                      var type = typeof tableHeights[rowIndex];
                      if (type === "undefined" || (cellHeight !== 'auto' && type === "number" && cellHeight > tableHeights[rowIndex]) || (cellHeight !== 'auto' && tableHeights[rowIndex] === 'auto')) {
                        tableHeights[rowIndex] = cellHeight;
                      }
                    });
                  });
                  if (tableWidths.length > 0) ret.table.widths = tableWidths;
                  if (tableHeights.length > 0) ret.table.heights = tableHeights;
                }

                // check if we have some data-pdfmake to apply
                if (element.dataset && element.dataset.pdfmake) {
                  try{
                    dataset = JSON.parse(element.dataset.pdfmake);
                  }catch(e){
                    if(element.dataset.pdfmake){
                      try{
                        element.dataset.pdfmake = element.dataset.pdfmake.replace(/'/g,'"');
                        dataset = JSON.parse(element.dataset.pdfmake);
                      }catch(e){
                        console.log(e);
                        dataset = {};
                      }
                    }
                  }
                  for (key in dataset) {
                    if (key === "layout") {
                      ret.layout = dataset[key];
                    } else {
                      ret.table[key] = dataset[key];
                    }
                  }
                }
                break;
              }
              case "TH":
              case "TD":{
                if (element.getAttribute("rowspan")) ret.rowSpan = element.getAttribute("rowspan")*1;
                if (element.getAttribute("colspan")) ret.colSpan = element.getAttribute("colspan")*1;
                // apply all the inhirent classes and styles from the parents, or for the current element
                ret = applyStyle({ret:ret, parents:parents.concat([element])});
                break;
              }
              case "SVG": {
                ret = {
                  svg:element.outerHTML.replace(/\n(\s+)?/g, ""),
                  nodeName:'SVG',
                  style:['html-svg']
                }
                break;
              }
              case "BR": {
                // for BR we return '\n'
                ret.text = [{text:'\n'}];
                break;
              }
              case "SUB":
              case "SUP": {
                ret[nodeName.toLowerCase()] = { offset: '30%', fontSize: 8 };
                break;
              }
              case "HR": {
                // default style for the HR
                var styleHR = {
                  width: 514,
                  type: "line",
                  margin: [0, 12, 0, 12],
                  thickness: 0.5,
                  color: "#000000",
                  left: 0
                };
                // we can override the default HR style with "data-pdfmake"
                if (element.dataset && element.dataset.pdfmake) {
                  dataset = JSON.parse(element.dataset.pdfmake);
                  for (key in dataset) {
                    styleHR[key] = dataset[key];
                  }
                }

                ret.margin = styleHR.margin;
                ret.canvas = [
                  {
                    type: styleHR.type,
                    x1: styleHR.left,
                    y1: 0,
                    x2: styleHR.width,
                    y2: 0,
                    lineWidth: styleHR.thickness,
                    lineColor: styleHR.color
                  }
                ];
                delete ret.text;

                break;
              }
              case "OL":
              case "UL": {
                ret[nodeNameLowerCase] = (ret.stack || ret.text).slice(0);
                delete ret.stack;
                delete ret.text;
                // apply all the inhirent classes and styles from the parents, or for the current element
                ret = applyStyle({ret:ret, parents:parents.concat([element])});
                // check if we have `list-style-type` or `list-style`
                if (ret.listStyle || ret.listStyleType) ret.type = ret.listStyle || ret.listStyleType;
                break;
              }
              case "IMG": {
                ret.image = element.getAttribute("src");
                delete ret.stack;
                delete ret.text;
                // apply all the inhirent classes and styles from the parents, or for the current element
                ret = applyStyle({ret:ret, parents:parents.concat([element])});
                if(ret.image.indexOf('http')===0){
                  var width = ret.width ? ret.width : 720;
                  var height = ret.height ? ret.height : 720;
                  ret.image = await urltobase64(ret.image,width,height, true);
                }
                break;
              }
              case "A": {
                ret.link = element.getAttribute("href");
                break;
              }
              case "FONT": {
                if (element.getAttribute("color")) {
                  ret.color = parseColor(element.getAttribute("color"));
                }
                // Checking if the element has a size attribute
                if (element.getAttribute("size")) {
                  // Getting and sanitizing the size value – it should be included between 1 and 7
                  var size = Math.min(Math.max(1, parseInt(element.getAttribute("size"))), 7);

                  // Getting the relative fontsize
                  var fontSize = Math.max(fontSizes[0], fontSizes[size - 1]);

                  // Assigning the font size
                  ret.fontSize = fontSize;
                }

                // Applying inherited styles
                ret = applyStyle({
                  ret: ret,
                  parents: parents.concat([element]),
                });
                break;
              }
            }
            if (Array.isArray(ret.text) && ret.text.length === 1 && ret.text[0].text && !ret.text[0].nodeName) {
              ret.text = ret.text[0].text;
            }

            // chekck if we have some data-pdfmake to apply
            if (['HR','TABLE'].indexOf(nodeName) === -1 && element.dataset && element.dataset.pdfmake) {
              dataset = JSON.parse(element.dataset.pdfmake);
              for (key in dataset) {
                ret[key] = dataset[key];
              }
            }
            
          }
        }
        resolve(ret);
      });
    }

    var searchForStack = function(ret) {
      if (Array.isArray(ret.text)) {
        for (var i=0; i<ret.text.length; i++) {
          if (ret.text[i].stack || ['P','DIV','TABLE','SVG','UL','OL','IMG','H1','H2','H3','H4','H5','H6'].indexOf(ret.text[i].nodeName) > -1) return true;
          if (searchForStack(ret.text[i]) === true) return true;
        }
      }
      return false;
    }

    /**
     * Add empty cells due to rowspan
     *
     * @param {Object} params
     *   @param {Array} rows
     *   @param {Object} cell
     *   @param {Number} rowIndex Current row index
     *   @param {Number} cellIndex Current cell index
     */
    var setRowSpan = function(params) {
      var cells;
      if (params.cell.rowSpan) {
        for (var i=1; i <= params.cell.rowSpan-1; i++) {
          cells = (params.rows[params.rowIndex+i].text || params.rows[params.rowIndex+i].stack);
          cells.splice(params.cellIndex, 0, {text:''});
        }
      }
    }

    /**
     * Apply style and classes from all the parents
     *
     * @param  {Object} params
     *   @param {Object} ret The object that will receive the 'style' and other properties
     *   @param {Array} parents Array of node elements
     * @return {Object} the modified 'ret'
     */
    var applyStyle = function(params) {
      var cssClass = [];
      var lastIndex = params.parents.length-1;
      params.parents.forEach(function(parent, parentIndex) {
        // classes
        var parentNodeName = parent.nodeName.toLowerCase();
        var htmlClass = 'html-' + parentNodeName;
        if (htmlClass !== 'html-body' && cssClass.indexOf(htmlClass) === -1) cssClass.unshift(htmlClass);
        var parentClass = (parent.getAttribute("class")||"").split(' ');
        parentClass.forEach(function(p) {
          if (p) cssClass.push(p);
        });
        // styles
        var style;
        // not all the CSS properties should be inhirent
        var ignoreNonDescendentProperties = (parentIndex!==lastIndex);
        // 1) the default styles
        if (defaultStyles[parentNodeName]) {
          for (style in defaultStyles[parentNodeName]) {
            if (defaultStyles[parentNodeName].hasOwnProperty(style)) {
              if (!ignoreNonDescendentProperties ||
                  (ignoreNonDescendentProperties &&
                    style.indexOf('margin') === -1 &&
                    style.indexOf('border') === -1
                  )
                ) {
                // 'decoration' can be an array
                if (style === 'decoration') {
                  if (!Array.isArray(params.ret[style])) params.ret[style]=[];
                  params.ret[style].push(defaultStyles[parentNodeName][style]);
                } else {
                  params.ret[style] = defaultStyles[parentNodeName][style];
                }
              }
            }
          }
        }
        // 2) element's style
        // we want TD/TH to receive descendent properties from TR
        if (parentNodeName === 'tr') ignoreNonDescendentProperties=false;
        style = parseStyle(parent, ignoreNonDescendentProperties);
        style.forEach(function(stl) {
          // 'decoration' can be an array
          if (stl.key === "decoration") {
            if (!Array.isArray(params.ret[stl.key])) params.ret[stl.key]=[];
            params.ret[stl.key].push(stl.value);
          } else {
            params.ret[stl.key] = stl.value;
          }
        });
      });
      params.ret.style = cssClass;
      return params.ret;
    }

    /**
     * Transform a CSS expression (e.g. 'margin:10px') in the PDFMake version
     *
     * @param {String} style The CSS expression to transform
     * @param {DOMElement} element
     * @param {Boolean} ignoreProperties TRUE when we have to ignore some properties, like border, padding, margin
     * @returns {Array} array of {key, value}
     */
    var parseStyle = function(element, ignoreProperties) {
      var style = element.getAttribute("style") || "";
      style = style.split(';');
      // check if we have "width" or "height"
      if (element.getAttribute("width")) {
        style.unshift("width:" + element.getAttribute("width") + "px");
      }
      if (element.getAttribute("height")) {
        style.unshift("height:" + element.getAttribute("height") + "px");
      }
      var styleDefs = style.map(function(style) { return style.toLowerCase().split(':') });
      var ret = [];
      var borders = []; // special treatment for borders
      var nodeName = element.nodeName.toUpperCase();
      styleDefs.forEach(function(styleDef) {
        if (styleDef.length===2) {
          var key = styleDef[0].trim();
          var value = styleDef[1].trim();
          switch (key) {
            case "margin": {
              if (ignoreProperties) break;
              // pdfMake uses a different order than CSS
              value = value.split(' ');
              if (value.length===1) value=[value[0], value[0], value[0], value[0]];
              else if (value.length===2) value=[value[1], value[0]]; // vertical | horizontal ==> horizontal | vertical
              else if (value.length===3) value=[value[1], value[0], value[1], value[2]]; // top | horizontal | bottom ==> left | top | right | bottom
              else if (value.length===4) value=[value[3], value[0], value[1], value[2]]; // top | right | bottom | left ==> left | top | right | bottom

              // we now need to convert to PT
              value.forEach(function(val, i) {
                value[i] = convertToUnit(val);
              });
              // ignore if we have a FALSE in the table
              if (value.indexOf(false) === -1) ret.push({key:key, value:value});
              break;
            }
            case "text-align": {
              ret.push({key:"alignment", value:value});
              break;
            }
            case "font-weight": {
              if (value === "bold") ret.push({key:"bold", value:true});
              break;
            }
            case "text-decoration": {
              ret.push({key:"decoration", value:toCamelCase(value)})
              break;
            }
            case "font-style": {
              if (value==="italic") ret.push({key:"italics", value:true});
              break;
            }
            case "font-family": {
              ret.push({key:"font", value:value.split(',')[0].replace(/"|^'|^\s*|\s*$|'$/g,"").replace(/^([a-z])/g, function (g) { return g[0].toUpperCase() }).replace(/ ([a-z])/g, function (g) { return g[1].toUpperCase() })});
              break;
            }
            case "color": {
              ret.push({key:"color", value:parseColor(value)})
              break;
            }
            case "background-color": {
              // if TH/TD and key is 'background', then we use 'fillColor' instead
              ret.push({key:(nodeName === 'TD' || nodeName === 'TH' || nodeName === 'TR' ? "fillColor" : "background"), value:parseColor(value)})
              break;
            }
            case "text-indent": {
              ret.push({key:"leadingIndent", value:convertToUnit(value)});
              break;
            }
            case "white-space": {
              ret.push({key:"preserveLeadingSpaces", value:(value==='break-spaces' || value.slice(0,3) === 'pre')});
              break;
            }
            default: {
              // for borders
              if (key === 'border' || key.indexOf('border-left') === 0 || key.indexOf('border-top') === 0 || key.indexOf('border-right') === 0 || key.indexOf('border-bottom') === 0) {
                if (!ignoreProperties) borders.push({key:key, value:value});
              } else {
                // ignore some properties
                if (ignoreProperties && (key.indexOf("margin-") === 0 || key === 'width' || key === 'height')) break;
                // padding is not supported by PDFMake
                if (key.indexOf("padding") === 0) break;
                if (key.indexOf("-") > -1) key=toCamelCase(key);
                if (value) {
                  // convert value to a 'pt' when possible
                  var parsedValue = convertToUnit(value);
                  ret.push({key:key, value:(parsedValue === false ? value : parsedValue)});
                }
              }
            }
          }
        }
      });
      // for borders
      if (borders.length > 0) {
        // we have to merge together the borders in two properties
        var border = []; // array of boolean
        var borderColor = []; // array of colors
        borders.forEach(function(b) {
          // we have 3 properties: width style color
          var properties = b.value.split(' ');
          var width = properties[0].replace(/(\d+)(\.\d+)?([^\d]+)/g,"$1$2 ").trim();
          var index = -1, i;
          if (b.key.indexOf('-left') > -1) index=0;
          else if (b.key.indexOf('-top') > -1) index=1;
          else if (b.key.indexOf('-right') > -1) index=2;
          else if (b.key.indexOf('-bottom') > -1) index=3;
          // for the width
          if (index > -1) {
            border[index] = (width > 0);
          } else {
            for (i=0; i<4; i++) border[i] = (width > 0);
          }
          // for the color
          if (properties.length > 2) {
            var color = properties.slice(2).join(' ');
            if (index > -1) {
              borderColor[index] = parseColor(color);
            } else {
              for (i=0; i<4; i++) borderColor[i] = parseColor(color);
            }
          }
        });
        // fill the gaps
        for (var i=0; i<4; i++) {
          if (border.length > 0 && typeof border[i] === "undefined") border[i]=true;
          if (borderColor.length > 0 && typeof borderColor[i] === "undefined") borderColor[i]='#000000';
        }
        if (border.length > 0) ret.push({key:'border', value:border});
        if (borderColor.length > 0) ret.push({key:'borderColor', value:borderColor});
      }
      return ret;
    }

    var toCamelCase = function(str) {
      return str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase() });
    }

    /**
     * Returns the color in a hex format (e.g. #12ff00).
     * Also tries to convert RGB colors into hex values
     *
     * @param color color as string representation
     * @returns color as hex values for pdfmake
     */
    var parseColor = function(color) {
      var haxRegex = new RegExp('^#([0-9a-f]{3}|[0-9a-f]{6})$');

      // e.g. `#fff` or `#ff0048`
      var rgbRegex = new RegExp('^rgb\\((\\d+),\\s*(\\d+),\\s*(\\d+)\\)$');

      // e.g. rgb(0,255,34) or rgb(22, 0, 0)
      var nameRegex = new RegExp('^[a-z]+$');

      if (haxRegex.test(color)) {
        return color;
      } else if (rgbRegex.test(color)) {
        var decimalColors = rgbRegex.exec(color).slice(1);
        for (var i = 0; i < 3; i++) {
          var decimalValue = +decimalColors[i];
          if (decimalValue > 255) {
            decimalValue = 255;
          }
          var hexString = '0' + decimalValue.toString(16);
          hexString = hexString.slice(-2);
          decimalColors[i] = hexString;
        }
        return '#' + decimalColors.join('');
      } else if (nameRegex.test(color)) {
        return (color === "transparent" ? "white" : color);
      } else {
        // console.error('Could not parse color "' + color + '"');
        return color;
      }
    }

    /**
     * Convert 'px'/'rem'/'cm' to 'pt', and return false for the other ones. If it's only a number, it will just return it
     *
     * @param  {String} val The value with units (e.g. 12px)
     * @return {Number|Boolean} Return the pt value, or false
     */
    var convertToUnit = function(val) {
      // if it's just a number, then return it
      if (!isNaN(parseFloat(val)) && isFinite(val)) return val*1;
      var mtch = (val+"").trim().match(/^(\d+(\.\d+)?)(pt|px|rem|cm)$/);
      // if we don't have a number with supported units, then return false
      if (!mtch) return false;
      val = mtch[1];
      switch(mtch[3]) {
        case 'px':{
          val = Math.round(val * 0.75292857248934); // 1px => 0.75292857248934pt
          break;
        }
        case 'rem':{
          val *= 12; // default font-size is 12pt
          break;
        }
        case 'cm':{
          val = Math.round(val * 28.34646); // 1cm => 28.34646
          break;
        }
      }
      return val*1;
    }


    function isValidURL(string) {
      var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
      return (res !== null);
    };

// noerror: true => returns an image loaded in "this.filebase64"
// noerror: false => return text error
async function urltobase64(url, width,height,noerror) {
  return new Promise(async (resolve,reject) => {
  try{
    url = isValidURL(url) ? url : null;
    if(url && typeof(url)==='string') {
      if(base64cache && base64cache[url+width+height]) {
        resolve(base64cache[url+width+height].thumbnail);
        base64cache[url+width+height].created = new Date().getTime();
      } else {
        if(Number.isNaN(width)) {
          width = 720;
        }
        if(Number.isNaN(height)) {
          height = 1280;
        }
        const response = await fetch(url);
        const buffer = await response.buffer();
        let options = { width: width, height: height, responseType: 'base64' };
        if(imageThumbnail && fetch) {
          imageThumbnail(buffer, options).then(thumbnail => {
            resolve('data:image/jpeg;base64,'+thumbnail);
            if(base64cache && !base64cache[url+width+height]) {
              base64cache[url+width+height] = {
                thumbnail: 'data:image/jpeg;base64,'+thumbnail,
                created: new Date().getTime(),
                ttl: ttl // 15min
              };
            }
          }).catch(err => {
            if(noerror) {
              if(base64cache && !base64cache[url+width+height]){
                base64cache[url+width+height] = {
                  thumbnail:filebase64,
                  created: new Date().getTime(),
                  ttl: ttlempty // 
                };
              }
              resolve(this.filebase64);
            } else {
              var t = 'error showing error';
            try {
              t = JSON.stringify(err,null,2);  
            } catch (error) {
              console.log(err);
            }
              reject({error:405, text: 'can not convert image', err:t});
            }
          });
        } else {
          resolve(this.filebase64);
        }
      }
    } else {
      if(noerror){
        resolve(this.filebase64);
      } else {
        reject({error:403, text:'there is no valid url'});
      }
    }
  }catch(err) {
    if(noerror) {
      if(base64cache && !base64cache[url+width+height]){
        base64cache[url+width+height] = {
          thumbnail:filebase64,
          created: new Date().getTime(),
          ttl: ttlempty // 
        };
      }
      resolve(this.filebase64);
    } else {
      var t = 'error showing error';
      try {
        t = JSON.stringify(err,null,2);  
      } catch (error) {
        console.log(err);
      }
      reject({error:405, text: 'can not download image', err:t});
    }
  }
  });
}

    convertHtml(htmlText).then(res=>{
      resolve(res);
    }).catch(err=>{
      reject(err);
    });
  });
}
}
