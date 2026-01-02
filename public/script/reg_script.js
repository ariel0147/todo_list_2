async function register() {
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let userName = document.getElementById('userName').value;
    let pass = document.getElementById('pass').value;
    try {
        if (name && email && userName && pass) {
            let response = await fetch('/auth/reg', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, userName, pass })
            })
            if (response.status == 201) {
                window.location.href = '/login';
                return;
            }
            let data = await response.json();
            alert(data.message);
        }else{
            alert("חסרים נתונים")
        }
    } catch (err) {
        alert(err)
    }

}
// האזנה לתזוזת העכבר בכל המסמך
document.addEventListener('mousemove', function(e) {
    const glow = document.querySelector('.cursor-glow');
    if (glow) {
        // עדכון המיקום של הדיב למיקום העכבר
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    }
});

/* --- לוגיקה של דרקון מעופף עם "שדה כוח" מורחב --- */
let mouseX = 0, mouseY = 0;
let dragonX = 0, dragonY = 0;
const speed = 0.08;
const dragonSize = 160;
const offset = dragonSize / 2; // הרדיוס של הדרקון (80px)

document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateDragon() {
    const dragon = document.querySelector('.cursor-glow');
    // בוחר את האלמנטים שאסור לדרקון לגעת בהם
    const forbiddenZones = document.querySelectorAll('.input, table');

    if (dragon) {
        let targetX = mouseX;
        let targetY = mouseY;

        // בדיקה עבור כל אזור אסור
        forbiddenZones.forEach(zone => {
            const rect = zone.getBoundingClientRect();

            // יצירת "גדר" וירטואלית מסביב לאלמנט במרחק הרדיוס של הדרקון
            // זה מבטיח שהדרקון יעצור *לפני* שהוא נוגע בקיר
            const limitLeft = rect.left - offset;
            const limitRight = rect.right + offset;
            const limitTop = rect.top - offset;
            const limitBottom = rect.bottom + offset;

            // בדיקה: האם העכבר נמצא בתוך ה"גדר" הזו?
            if (mouseX > limitLeft && mouseX < limitRight &&
                mouseY > limitTop && mouseY < limitBottom) {

                // חישוב המרחק לכל אחד מהקירות של הגדר
                const distLeft = mouseX - limitLeft;
                const distRight = limitRight - mouseX;
                const distTop = mouseY - limitTop;
                const distBottom = limitBottom - mouseY;

                // מציאת הקיר הקרוב ביותר והצמדת היעד אליו
                const min = Math.min(distLeft, distRight, distTop, distBottom);

                if (min === distLeft) targetX = limitLeft;
                else if (min === distRight) targetX = limitRight;
                else if (min === distTop) targetY = limitTop;
                else if (min === distBottom) targetY = limitBottom;
            }
        });

        // תנועה חלקה ליעד המחושב (העכבר או הגדר)
        dragonX += (targetX - dragonX) * speed;
        dragonY += (targetY - dragonY) * speed;

        // חישוב זווית
        const dx = targetX - dragonX;
        const dy = targetY - dragonY;
        let angle = Math.atan2(dy, dx) * 180 / Math.PI;

        // תיקון זווית (מותאם לתמונה שפונה שמאלה)
        angle = angle - 180;

        // עדכון המיקום
        dragon.style.left = dragonX + 'px';
        dragon.style.top = dragonY + 'px';
        dragon.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
    }

    requestAnimationFrame(animateDragon);
}

animateDragon();