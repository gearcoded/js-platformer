
function generateObjects() {
	for (name in objects) {
		const entity = objects[name];

		if (entity.positions) {
			entity.positions.forEach(function (position) {
				addElement(entity.className, position, entity.solid)
			})
		}
		else {
			const position = { x: entity.x, y: entity.y, width: entity.width, height: entity.height };
			addElement(entity.className, position, entity.solid)
		}
	}
}

function addElement(className, position, solid) {
	const el = document.createElement("div")
	el.className = className;
	el.style.left = Math.floor(position.x) + "px";
	el.style.top = Math.floor(position.y) + "px";
	el.style.height = position.height + "px";
	el.style.width = position.width + "px";
	if (solid) {
		el.setAttribute("data-solid", solid)
	}
	const root = document.querySelector("#container");
	root.appendChild(el)
}

function savePositions() {
	for (name in objects) {
		const entity = objects[name];
		if (entity.positions) {
			const els = document.querySelectorAll("." + entity.className);
			entity.positions = [];
			els.forEach(function (el) {
				entity.positions.push(calculateSavePosition(el))
			})
		}
		else {
			const el = document.querySelector("." + entity.className);
			const position = calculateSavePosition(el)
			entity.x = position.x;
			entity.y = position.y;
			entity.width = position.width;
			entity.height = position.height;
			if (el.dataset.solid){
				entity.solid = el.dataset.solid
			}
		}
	}
	return JSON.stringify(objects)
}

function calculateSavePosition(el) {
	const position = {
		x: parseInt(el.style.left) || 0,
		y: parseInt(el.style.top) || 0,
		width: parseInt(el.style.width) || 0,
		height: parseInt(el.style.height) || 0,

	}
	return position;
}
