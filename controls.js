const speed = 10;
const gravity = 0.98;

const tempFloorPos = 400;

const controls = {
	left: "ArrowLeft",
	right: "ArrowRight",
	jump: " ",
}

const pressedKeys = {
	left: false,
	right: false,
	jump: 0
}




////////////////////////////////////////////////////
// listeners

window.addEventListener("mousedown", function (e) {
	if (e.ctrlKey) {
		cloneElement(e.target)
	}
	else if (e.shiftKey) {
		// console.log(e)
		resizedElement = {
			el: e.target,
			x: e.clientX,
			y: e.clientY,
		};
	}
	else {
		movedElement = e.target;
	}
	console.log(e)
})

window.addEventListener("mousemove", function (e) {
	if (movedElement) {
		manuallyMoveElement(e)
	}
	if (resizedElement) {
		// console.log(e)
		manuallyResizeElement(e)
	}
})

window.addEventListener("mouseup", function (e) {
	movedElement = null;
	resizedElement = null;
})


window.addEventListener("keydown", function (e) {
	// console.log("ki", e.key)
	keyDown(e.key)

	switch (e.key) {
		case controls.left:
		case controls.right:
		case controls.jump:
			e.preventDefault()
	}
})
window.addEventListener("keyup", function (e) {
	// console.log("ki", e.key)
	keyUp(e.key)

	switch (e.key) {
		case controls.left:
		case controls.right:
		case controls.jump:
			e.preventDefault()
	}
})




////////////////////////////////////////////////////
// functions


let movedElement = null;
let resizedElement = null;

function manuallyMoveElement(e) {
	const rect = movedElement.getBoundingClientRect()
	movedElement.style.left = e.clientX - rect.width / 2 + "px";
	movedElement.style.top = e.clientY - rect.height / 2 + "px";
}

function manuallyResizeElement(e) {
	const diffX = -resizedElement.x + e.clientX;
	const diffY = -resizedElement.y + e.clientY;

	resizedElement.x = e.clientX;
	resizedElement.y = e.clientY;

	resizedElement.el.style.width = (parseInt(resizedElement.el.style.width) || 0) + diffX + "px";
	resizedElement.el.style.height = (parseInt(resizedElement.el.style.height) || 0) + diffY + "px";
}


function cloneElement(el) {
	let clone = el.cloneNode();
	clone.style.left = parseInt(clone.style.left) + 10 + "px";
	clone.style.top = parseInt(clone.style.top) + 10 + "px";
	const root = document.querySelector("#container");
	root.appendChild(clone)
}


function keyDown(key) {
	switch (key) {
		case controls.left:
			pressedKeys.left = true;
			move(-1);
			break;
		case controls.right:
			pressedKeys.right = true;
			move(1);
			break;

		case controls.jump:
			window.requestAnimationFrame(function () {
				if (pressedKeys.jump < 2) {
					pressedKeys.jump++;
					jump();
				}
			})
			break;
	}
}

function keyUp(key) {
	switch (key) {
		case controls.left:
			pressedKeys.left = false;
			break;
		case controls.right:
			pressedKeys.right = false;
			break;
	}
}




function move(direction) {
	cube.speed = speed * direction
}
function jump() {
	cube.gravity = -15

	//console.log(direction, speed, x, cube.style.left)
	// getCube().style.top = x + speed * direction + "px";
}

function getCube() {
	const cube = document.querySelector(".cube");
	return cube;
}

function getEl(x, y) {
	const el = document.elementFromPoint(x, y);
	if (el && el.dataset.solid) {
		return el.getBoundingClientRect();
	}
}






////////////////////////////////////////////////////
// player actions

function playerAction() {
	// gravity
	const bottom = cube.y + cube.height;

	let elementBelow = null;
	for (let i = cube.x; i <= cube.x + cube.width; i++) {
		elementBelow = getEl(i, bottom);
		if (elementBelow){
			break;
		}
	}
	if (elementBelow) {
		if (bottom + cube.gravity <= elementBelow.y) {
			cube.gravity += gravity;
			cube.y = cube.y + cube.gravity;
		}
		else {
			cube.y += elementBelow.y - bottom;
			pressedKeys.jump = 0;
		}
	} else {
		cube.gravity += gravity;
		cube.y = cube.y + cube.gravity;
	}
	getCube().style.top = cube.y + "px"

	// speed
	if (pressedKeys.left || pressedKeys.right) {
		if (pressedKeys.left) {
			const elementLeft = getEl(cube.x - 1, cube.y);
			if (elementLeft) {
				cube.speed = 0
			}
		}
		if (pressedKeys.right) {
			const elementRight = getEl(cube.x + cube.width + 1, cube.y);
			if (elementRight) {
				cube.speed = 0
			}
		}
	}
	else {
		cube.speed = 0
	}
	cube.x += cube.speed;
	getCube().style.left = cube.x + "px";
}
