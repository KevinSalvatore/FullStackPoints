/**
 * @param {String} template
 * @param {Object} data
 * @returns {String}
 * @description render the template with the data source
 */
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
var template =
  "<div>" +
  "<p>Name<span><% this.name %></span></p>" +
  "<p>Gender<span>" +
  "<% if(this.gender === 'male') { %>" +
      "Male" +
  "<% } else { %> " +
      "Female" +
  "<% } %>" +
  "</span></p>" +
  "</div>";
var data = {
  name: "AJie",
  gender: "male"
};
console.log(TemplateEngine(template, data));
