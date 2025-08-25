import redis from "redis";

var client = redis.createClient(process.env.REDISCLOUD_URL, {
  no_ready_check: true,
});

export function getCurrentColor() {
  return client.get("currentColor");
};

export function getAllColors() {
    return client.get("colors");
};

export function setColor(newColor) {
    client.set("currentColor", newColor);
}

export function addColor(colorName, colorAmount) {
    client.rpush("colors", { name: colorName, amount: colorAmount * 1000 });
}

export function updateColorAmount(colorName, addColorAmount) {
    client.get("colors", (err, colors) => {
        if (err) {
            console.error("Error fetching colors:", err);
            return;
        }
        let colorList = JSON.parse(colors) || [];
        let color = colorList.find(c => c.name === colorName);
        if (color) {
            color.amount += addColorAmount * 1000;
            client.set("colors", JSON.stringify(colorList));
        } else {
            console.error("Color not found:", colorName);
        }
    });
}
