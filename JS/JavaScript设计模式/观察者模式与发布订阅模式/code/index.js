function TemplateEngine(template, data) {
  var re = /<%([^%>]+)?%>/g,
    reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g,
    code = "var r=[];\n",
    cursor = 0,
    match;
  var add = function(line, js) {
    js
      ? (code += line.match(reExp) ? line + "\n" : "r.push(" + line + ");\n")
      : (code +=
          line != "" ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : "");
    return add;
  };
  while ((match = re.exec(template))) {
    add(template.slice(cursor, match.index))(match[1], true);
    cursor = match.index + match[0].length;
  }
  add(template.substr(cursor, template.length - cursor));
  code += 'return r.join("");';
  return new Function(code.replace(/[\r\t\n]/g, "")).apply(data);
}
var template = `<span><% this.value %></span>`;
var data = {
  value: 0
};
function render() {
  document.body.innerHTML = TemplateEngine(template, data);
}
window.onload = function() {
  render();
  pubsub.subscribe("change", render);
  setInterval(function() {
    data.value++;
    pubsub.publish("change");
  }, 1000);
};
