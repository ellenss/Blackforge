export async function getCurrentColor(client) {
  return await client.get("currentColor");
}

export async function getAllColors(client) {
  return await client.LRANGE("colors", 0, -1);
}

export function setColor(client, newColor) {
  client.set("currentColor", newColor);
}

export function addColor(client, colorName, colorAmount) {
  console.log("Adding color:", colorName, "Amount:", colorAmount * 1000);
  client.RPUSH(
    "colors",
    JSON.stringify({ name: colorName, amount: colorAmount * 1000 })
  );
}

export function updateColorAmount(client, colorName, addColorAmount) {
  client.LRANGE("colors", 0, -1).then((colors) => {
    let colorList = colors.map((c) => JSON.parse(c));
    let color = colorList.find((c) => c.name === colorName);
    if (color) {
      client.LREM("colors", 0, JSON.stringify(color));
      color.amount += addColorAmount * 1000;
      client.RPUSH("colors", JSON.stringify(color));
    } else {
      console.error("Color not found:", colorName);
    }
  });
}
