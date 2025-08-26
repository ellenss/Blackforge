export async function getCurrentColor(client) {
  return await client.get("currentColor");
};

export async function getAllColors(client) {
    return await client.get("colors");
};

export function setColor(client, newColor) {
    client.set("currentColor", newColor);
}

export function addColor(client, colorName, colorAmount) {
    client.RPUSH("colors", { name: colorName, amount: colorAmount * 1000 });
}

export function updateColorAmount(client, colorName, addColorAmount) {
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
