const options = document.querySelector(".control-div");

let IS_CREATE_ENABLED = false;
let IS_SHOW_POINTS_ENABLED = true;
let IS_SHOW_LINES_ENABLED = true;
let IS_SHOW_CURVES_ENABLED = true;
let IS_ADD_ENABLED_POINTS = false;
let IS_ACTIVE_FIRST_BUTTON = true;
let IS_FIRST_ACTION = false;
let IS_FIRST_CURVE = false;

function start() {
  setup_interface();
}

function cursorType(style) {
  const canvas = document.getElementById("canvas");
  canvas.style.cursor = style;
}

function setup_interface() {
  let button_label;
  let callback;

  options.innerHTML = "";

  if (!IS_CREATE_ENABLED) {
    button_label = "Nova curva";
    callback = "new_curve()";
  } else {
    button_label = "Terminar criação";
    callback = "done()";
  }
  create_button(button_label, callback);

  button_label = "Limpar";
  callback = "reset_sketch()";
  create_button(button_label, callback);

  if (!IS_SHOW_POINTS_ENABLED) {
    button_label = "Exibir Pontos";
  } else {
    button_label = "Ocultar Pontos";
  }
  callback = "show_points()";
  create_button(button_label, callback);

  if (!IS_SHOW_LINES_ENABLED) {
    button_label = "Exibir Linhas";
  } else {
    button_label = "Ocultar Linhas";
  }
  callback = "show_lines()";
  create_button(button_label, callback);

  if (!IS_SHOW_CURVES_ENABLED) {
    button_label = "Exibir Curvas";
  } else {
    button_label = "Ocultar Curvas";
  }
  callback = "show_curves()";
  create_button(button_label, callback);

  input();

  if (!IS_CREATE_ENABLED && points.length > 2 && !IS_ADD_ENABLED_POINTS) {
    button_label = "Próxima curva";
    callback = "next_curve()";
    create_button(button_label, callback);
  }

  if (!IS_CREATE_ENABLED && IS_FIRST_ACTION && points.length > 1) {
    if (!IS_ADD_ENABLED_POINTS) {
      button_label = "Adicionar Pontos";
      callback = "add_points()";
    } else {
      button_label = "Terminar de adicionar";
      callback = "finish_add_points()";
    }
    create_button(button_label, callback);
  }

  if (!IS_CREATE_ENABLED && selected != null && points[cursor].length > 3) {
    button_label = "Deletar Ponto";
    callback = "delete_point()";
    create_button(button_label, callback);
  }

  if (
    !IS_CREATE_ENABLED &&
    IS_FIRST_ACTION &&
    points.length > 1 &&
    !IS_ADD_ENABLED_POINTS
  ) {
    button_label = "Deletar Curva";
    callback = "delete_curve()";
    create_button(button_label, callback);
  }
}

function create_button(button_label, callback) {
  const button_div = document.createElement("div");
  button_div.setAttribute("class", "button-container");

  if (button_label === "Nova curva")
    button_div.setAttribute("id", "create-button");

  if (
    button_label === "Terminar criação" ||
    button_label === "Terminar de adicionar"
  )
    button_div.setAttribute("id", "finish-creation");

  IS_ACTIVE_FIRST_BUTTON =
    (button_label === "Terminar criação" && points[cursor].length < 2) ||
    ((button_label === "Terminar criação" || button_label === "Nova curva") &&
      IS_ADD_ENABLED_POINTS)
      ? false
      : true;

  const disabledParameter = IS_ACTIVE_FIRST_BUTTON ? "" : "disabled";

  button_div.innerHTML = `
    <button onclick="${callback}" class="control-button" ${disabledParameter}>  
      <p>${button_label}</p>
    </button>
  `;

  options.appendChild(button_div);
}

function input() {
  const eval_points = document.getElementById("eval-number").value;

  t = eval_points;

  if (t < 1) {
    document.getElementById("eval-number").value = 100;
    t = 100;
  }
}

function done() {
  if (IS_FIRST_ACTION && points[cursor].length > 1) {
    IS_CREATE_ENABLED = false;
    points[points.length] = [];

    IS_FIRST_CURVE = true;
  }
}

function new_curve() {
  IS_CREATE_ENABLED = true;
  selected = null;

  cursorType("crosshair");

  if (!IS_FIRST_ACTION) IS_FIRST_ACTION = true;

  if (IS_FIRST_CURVE) cursor = points.length - 1;
}

function reset_sketch() {
  points = [[]];

  cursor = 0;
  selected = null;

  IS_CREATE_ENABLED = false;
  IS_SHOW_POINTS_ENABLED = true;
  IS_SHOW_LINES_ENABLED = true;
  IS_SHOW_CURVES_ENABLED = true;
  IS_ADD_ENABLED_POINTS = false;

  IS_ACTIVE_FIRST_BUTTON = true;

  IS_FIRST_CURVE = false;
}

function show_points() {
  IS_SHOW_POINTS_ENABLED = !IS_SHOW_POINTS_ENABLED;
}

function show_lines() {
  IS_SHOW_LINES_ENABLED = !IS_SHOW_LINES_ENABLED;
}

function show_curves() {
  IS_SHOW_CURVES_ENABLED = !IS_SHOW_CURVES_ENABLED;
}

function next_curve() {
  cursor = (cursor + 1) % (points.length - 1);

  selected = null;
}

function add_points() {
  IS_ADD_ENABLED_POINTS = true;
  cursorType("crosshair");
}

function finish_add_points() {
  IS_ADD_ENABLED_POINTS = false;
}

function delete_point() {
  const index = points[cursor].indexOf(selected);
  points[cursor].splice(index, 1);

  selected = null;
}

function delete_curve() {
  points.splice(cursor, 1);
  next_curve();
}
