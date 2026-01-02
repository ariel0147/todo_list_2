let greating = "Hello ";
greating += localStorage.getItem('name');
document.getElementById('greating').innerHTML = greating;