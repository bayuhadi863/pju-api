const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

const sensorTypes = [
  { name: "Humidity", code: "HUM", unit: "%" },
  { name: "Temperature", code: "TEMP", unit: "°C" },
  { name: "Solar Radiation", code: "SOLAR", unit: "kWH/m²" },
  { name: "Rainfall Level", code: "RAIN", unit: "mm" },
  { name: "Water Level", code: "WATER", unit: "cm" },
  { name: "Wind Speed", code: "WINDSPD", unit: "mph" },
  { name: "Wind Direction", code: "WINDDIR", unit: "°" },
  { name: "Carbon Monoxide", code: "CO", unit: "ppm" },
  { name: "Nitrogen Dioxide", code: "NO2", unit: "ppm" },
  { name: "Ozone", code: "O3", unit: "ppm" },
  { name: "Particulate Matter", code: "PM", unit: "µg/m³" },
  { name: "Sulfur Dioxide", code: "SO2", unit: "ppm" },
];

const MonitorTypes = [
  { name: "Voltage", code: "VOLT", unit: "V" },
  { name: "Current", code: "CURR", unit: "A" },
  { name: "Power", code: "POW", unit: "Watt" },
  { name: "Power Factor", code: "COSPHI", unit: "PF" },
  { name: "Temperature", code: "TEMP", unit: "°C" },
  { name: "Frequency", code: "FREQ", unit: "Hz" },
  { name: "Luminouse Intensity", code: "LUM", unit: "Lumen" },
];

async function main() {
  console.log(process.env.DATABASE_URL);
  // Insert SensorType data
  const createdSensorTypes = await prisma.sensorType.createMany({
    data: sensorTypes,
    skipDuplicates: true, // Avoid duplicating sensor types if they already exist
  });

  console.log(`Created ${createdSensorTypes.count} sensor types`);

  const createdMonitorTypes = await prisma.monitorType.createMany({
    data: MonitorTypes,
    skipDuplicates: true, // Avoid duplicating monitor types if they already exist
  });

  console.log(`Created ${createdSensorTypes.count} monitor types`);

  // generate admin user
  const ExistAdmin = await prisma.user.findFirst();
  if (!ExistAdmin) {
    if (process.env.ADMIN_EMAIL != "" || process.env.ADMIN_EMAIL != null) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

      const adminUser = await prisma.user.create({
        data: {
          email: process.env.ADMIN_EMAIL,
          password: hashedPassword,
        },
      });

      console.log("Created admin user kredentials from env");
    } else {
      const hashedPassword = await bcrypt.hash("adminMSIB", 10);

      const user = await prisma.user.create({
        data: {
          email: "admin@gmail.com",
          password: hashedPassword,
        },
      });

      console.log("Created default admin user");
    }
  }

  // // Create example SensorData
  // const exampleSensorData = [
  //   { value: 45.2, sensorTypeId: 1 },
  //   { value: 27.1, sensorTypeId: 2 },
  //   { value: 800, sensorTypeId: 3 },
  //   { value: 10, sensorTypeId: 4 },
  //   { value: 1.5, sensorTypeId: 5 },
  //   { value: 12.5, sensorTypeId: 6 },
  //   { value: 180, sensorTypeId: 7 },
  //   { value: 0.9, sensorTypeId: 8 },
  //   { value: 0.05, sensorTypeId: 9 },
  //   { value: 0.02, sensorTypeId: 10 },
  //   { value: 25.0, sensorTypeId: 11 },
  // ];

  // await prisma.sensorData.createMany({
  //   data: exampleSensorData,
  // });

  // console.log(`Created ${exampleSensorData.length} sensor data entries`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
