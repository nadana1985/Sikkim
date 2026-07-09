import db from './database';

const now = new Date().toISOString();

const monasteries = [
  {
    id: 'rumtek',
    name: 'Rumtek Monastery',
    description: 'Rumtek Monastery, also known as the Dharma Chakra Centre, is one of the most significant monasteries in Sikkim. It serves as the seat of the Karmapa, the head of the Karma Kagyu lineage of Tibetan Buddhism.',
    history: 'Founded in the mid-16th century by Rangjung Rigpe Dorje, the 4th Karmapa, Rumtek Monastery was originally built under the direction of the 9th Karmapa, Wangchuk Dorje. The current structure was rebuilt in the 1960s by the 16th Karmapa, Rangjung Rigpe Dorje, who made it his main seat in exile after leaving Tibet.',
    architecture: 'The monastery features a stunning blend of Tibetan and Sikkimese architectural styles. The main prayer hall houses a magnificent golden stupa containing the relics of the 16th Karmapa. The three-story structure is adorned with intricate murals, thangka paintings, and ornate woodwork. The surrounding complex includes a school, a retreat center, and beautifully landscaped gardens.',
    rituals: 'Daily prayers begin at dawn with monks chanting sutras in the main prayer hall. The monastery is famous for its annual Cham dance festival held during the Losar (Tibetan New Year) celebrations. The monks perform elaborate masked dances depicting the triumph of good over evil. Regular prayer sessions, meditation retreats, and teachings are conducted throughout the year.',
    foundedYear: 1740,
    latitude: 27.2877,
    longitude: 88.5682,
    address: 'Rumtek, East Sikkim, India',
    images: ['/images/rumtek-1.jpg', '/images/rumtek-2.jpg', '/images/rumtek-3.jpg'],
    virtualTourId: 'tour-rumtek',
  },
  {
    id: 'pemayangtse',
    name: 'Pemayangtse Monastery',
    description: 'Pemayangtse Monastery is one of the oldest and premier monasteries of Sikkim, belonging to the Nyingma sect of Tibetan Buddhism. It is perched at an altitude of 2,085 meters, offering breathtaking views of the Kanchenjunga range.',
    history: 'Established in 1705 by Lhatsun Namkha Jigme, one of the three learned lamas who played a crucial role in the consecration of the first Chogyal (king) of Sikkim, Pemayangtse has been a center of Nyingma Buddhist learning for over three centuries. The name means "Perfect Lotus Sublime Point."',
    architecture: 'The monastery showcases traditional Tibetan architecture with a seven-tiered wooden sculpture called "Zangdok Palri" (the celestial palace of Guru Rinpoche) on the top floor. The three-story building is decorated with elaborate frescoes, statues of deities, and ancient thangka paintings. The ground floor houses a large prayer hall with a magnificent central Buddha statue.',
    rituals: 'The monastery hosts the annual Chaam dance festival during the Losar period, featuring monks in colorful masks and costumes performing sacred dances. Daily morning and evening prayers are conducted in the main hall. The monastery also organizes pilgrimages to the sacred Khecheopalri Lake nearby.',
    foundedYear: 1705,
    latitude: 27.3506,
    longitude: 88.2636,
    address: 'Pelling, West Sikkim, India',
    images: ['/images/pemayangtse-1.jpg', '/images/pemayangtse-2.jpg'],
    virtualTourId: 'tour-pemayangtse',
  },
  {
    id: 'tashiding',
    name: 'Tashiding Monastery',
    description: 'Tashiding Monastery is one of the most sacred monasteries in Sikkim, believed to cleanse all sins of those who visit. It is perched on a hilltop between the Rathong and Rangit rivers, offering panoramic views of the surrounding mountains.',
    history: 'Founded in 1641 by the fourth Chogyal of Sikkim, Tashiding gets its name from the Tibetan words "ta" (view) and "shiding" (glory). The monastery was blessed by Guru Rinpoche (Padmasambhava) who is believed to have meditated in a cave nearby. It was rebuilt multiple times due to earthquakes, with the current structure dating from the 18th century.',
    architecture: 'The monastery sits atop a hill at an elevation of 1,795 meters. Its striking golden spire (stupa) is visible from miles away. The complex includes the main prayer hall with ancient scriptures, statues, and wall paintings. The surrounding area features numerous chortens (stupas) and prayer wheels that pilgrims spin as they walk the sacred path.',
    rituals: 'Tashiding is famous for its annual Bumchu festival, during which a sacred pot of water is opened and distributed among devotees. The water level is believed to predict the future of Sikkim. Daily prayers and meditation sessions are open to visitors. The monastery follows the Nyingma tradition and maintains strict monastic discipline.',
    foundedYear: 1641,
    latitude: 27.2833,
    longitude: 88.3500,
    address: 'Tashiding, West Sikkim, India',
    images: ['/images/tashiding-1.jpg', '/images/tashiding-2.jpg'],
    virtualTourId: undefined,
  },
  {
    id: 'ranka',
    name: 'Ranka Monastery (Lingdum)',
    description: 'Ranka Monastery, also known as Lingdum Monastery, is a relatively modern yet spectacular monastery of the Zurmang Kagyu lineage. Nestled amidst dense forests, it offers a serene retreat for Buddhist practice.',
    history: 'Established in 1998 under the guidance of the 12th Gyalwa Zurmang Trungpa Rinpoche, Ranka Monastery is one of the newer monasteries in Sikkim. Despite its recent establishment, it has quickly become a significant center for Buddhist learning and meditation, attracting monks and visitors from around the world.',
    architecture: 'The monastery complex features a stunning main prayer hall with a towering three-story structure. The architecture blends traditional Tibetan design with modern construction techniques. The hall houses a magnificent 18-foot statue of Guru Rinpoche and is adorned with intricate murals depicting scenes from the life of the Buddha. The surrounding forest adds to the monastery\'s peaceful atmosphere.',
    rituals: 'The monastery hosts regular prayer sessions, meditation retreats, and Buddhist teachings. Annual festivals include the Cham dance during Losar and special prayer ceremonies. The monks follow the Kagyu tradition and maintain a rigorous schedule of study, meditation, and ritual practice. Visitors are welcome to join morning prayers.',
    foundedYear: 1998,
    latitude: 27.2667,
    longitude: 88.5167,
    address: 'Ranka, East Sikkim, India',
    images: ['/images/ranka-1.jpg', '/images/ranka-2.jpg'],
    virtualTourId: undefined,
  },
  {
    id: 'dubdi',
    name: 'Dubdi Monastery',
    description: 'Dubdi Monastery is the oldest monastery in Sikkim, perched atop a hill at an elevation of 2,130 meters. It offers stunning views of the surrounding valleys and is a treasure trove of ancient Buddhist artifacts.',
    history: 'Established in 1701 by Lhatsun Namkha Jigme, one of the three learned lamas who consecrated the first Chogyal of Sikkim, Dubdi holds the distinction of being the oldest monastery in the state. The name "Dubdi" means "the retreat." It has been a center of Nyingma Buddhist practice for over three centuries.',
    architecture: 'The monastery is a modest yet historically significant structure built in traditional Sikkimese style. It features a main prayer hall with ancient thangkas, manuscripts, and statues of Buddhist deities. The wooden architecture is characteristic of the region, with carved beams and pillars. A sacred spring flows nearby, considered holy by devotees.',
    rituals: 'Daily prayers are conducted at dawn and dusk. The monastery observes all major Buddhist festivals with special prayer ceremonies. The monks maintain a strict routine of meditation, study, and ritual practice. Pilgrims visit the sacred spring and circumambulate the monastery for spiritual merit.',
    foundedYear: 1701,
    latitude: 27.3167,
    longitude: 88.3333,
    address: 'Yuksom, West Sikkim, India',
    images: ['/images/dubdi-1.jpg'],
    virtualTourId: undefined,
  },
  {
    id: 'enchey',
    name: 'Enchey Monastery',
    description: 'Enchey Monastery is a 200-year-old monastery of the Nyingma sect, located on a hilltop above Gangtok. It is believed to be blessed by the flying lama Drupthop Karpo and is an important center for Buddhist worship.',
    history: 'Built in 1840, Enchey Monastery was established to honor Drupthop Karpo, a renowned monk known for his ability to fly. The monastery was built on a site blessed by Lama Druptob Karpo, who is said to have flown from Maenam Hill to this location. The current structure was renovated in the 1900s after damage from an earthquake.',
    architecture: 'The monastery features a distinctive pagoda-style architecture with a golden spire. The main prayer hall houses statues of Guru Padmasambhava, Avalokiteshvara, and other Buddhist deities. The walls are decorated with elaborate murals and thangka paintings. The surrounding compound includes smaller shrines and a prayer wheel pavilion.',
    rituals: 'Enchey Monastery is famous for its annual Chaam dance performed during the Pang Lhabsol festival (worship of Mount Kanchenjunga). The monks perform masked dances to the beat of traditional drums and cymbals. Daily prayers and meditation sessions are conducted in the main hall. The monastery also performs protective rituals for the state of Sikkim.',
    foundedYear: 1840,
    latitude: 27.3333,
    longitude: 88.6333,
    address: 'Gangtok, East Sikkim, India',
    images: ['/images/enchey-1.jpg', '/images/enchey-2.jpg'],
    virtualTourId: undefined,
  },
];

const festivals = [
  {
    id: 'losar-2025',
    name: 'Losar (Tibetan New Year)',
    description: 'Losar is the most important festival in Sikkim, celebrating the Tibetan New Year with elaborate rituals, masked dances, feasting, and cultural performances. It marks the beginning of a new year in the Tibetan calendar.',
    date: '2026-02-17',
    duration: 15,
    significance: 'Losar marks the victory of good over evil and the renewal of life. The festival involves purification rituals, prayer ceremonies, and the famous Cham dances performed by monks in colorful masks. Families prepare traditional dishes, exchange gifts, and visit monasteries to offer prayers for the coming year.',
    monasteryId: 'rumtek',
    images: ['/images/losar-1.jpg', '/images/losar-2.jpg'],
  },
  {
    id: 'bumchu-2025',
    name: 'Bumchu Festival',
    description: 'Bumchu is a sacred water festival held at Tashiding Monastery, one of the most mysterious and sacred festivals in Sikkim. A pot of sacred water is opened to reveal its level, which predicts the future of Sikkim.',
    date: '2026-03-05',
    duration: 3,
    significance: 'The festival centers on a sacred pot (Bumchu) filled with water from the Rangit River, blessed by Guru Rinpoche. The water level inside the pot is examined to predict the future prosperity and peace of Sikkim. Devotees receive the sacred water as prasad for spiritual cleansing.',
    monasteryId: 'tashiding',
    images: ['/images/bumchu-1.jpg'],
  },
  {
    id: 'pang-lhabsol-2025',
    name: 'Pang Lhabsol',
    description: 'Pang Lhabsol is a warrior dance festival celebrating Mount Kanchenjunga, the guardian deity of Sikkim. Monks perform elaborate masked dances depicting the legendary protectors of the Himalayan region.',
    date: '2026-09-08',
    duration: 2,
    significance: 'This festival honors Mount Kanchenjunga, believed to be the guardian deity of Sikkim. The elaborate Cham dances depict the protectors of the Buddhist faith. The festival is unique to Sikkim and combines Hindu and Buddhist traditions, reflecting the syncretic culture of the region.',
    monasteryId: 'enchey',
    images: ['/images/pang-lhabsol-1.jpg'],
  },
  {
    id: 'saga-dawa-2025',
    name: 'Saga Dawa',
    description: 'Saga Dawa commemorates the birth, enlightenment, and death (parinirvana) of Lord Buddha. It is one of the most sacred Buddhist festivals celebrated with great devotion across Sikkim.',
    date: '2026-06-11',
    duration: 3,
    significance: 'Saga Dawa is considered the holiest day in the Buddhist calendar. Devotees observe fasting, perform circumambulations of monasteries, light butter lamps, and release captive animals as acts of merit. The festival commemorates the three most important events in the life of Gautama Buddha.',
    monasteryId: 'pemayangtse',
    images: ['/images/saga-dawa-1.jpg'],
  },
  {
    id: 'dashain-2025',
    name: 'Dashain',
    description: 'Dashain is the longest and most widely celebrated festival in Sikkim, honoring the victory of Goddess Durga over the demon Mahishasur. It is a time of family reunions, feasting, and cultural celebrations.',
    date: '2026-10-20',
    duration: 15,
    significance: 'Dashain celebrates the triumph of good over evil. Families gather to receive blessings from elders, fly kites, play cards, and feast on traditional delicacies. The festival is celebrated with great enthusiasm across all communities in Sikkim, reflecting the region\'s cultural diversity.',
    monasteryId: 'rumtek',
    images: ['/images/dashain-1.jpg'],
  },
  {
    id: 'maghe-sankranti-2026',
    name: 'Maghe Sankranti',
    description: 'Maghe Sankranti marks the sun\'s transition into Capricorn and is celebrated with holy baths, temple visits, and traditional feasts across Sikkim.',
    date: '2026-01-14',
    duration: 1,
    significance: 'This festival marks the beginning of longer days and the end of the winter solstice period. Devotees take holy baths in rivers and streams, visit temples and monasteries, and prepare traditional foods including sesame sweets and sugarcane. It is believed that bathing on this day cleanses sins and brings good fortune.',
    monasteryId: 'dubdi',
    images: ['/images/maghe-sankranti-1.jpg'],
  },
];

const tours = [
  {
    id: 'tour-rumtek',
    name: 'Rumtek Monastery Virtual Tour',
    description: 'Explore the magnificent Rumtek Monastery through this immersive 360° virtual tour. Walk through the golden prayer hall, admire the intricate murals, and experience the serene atmosphere of this sacred Buddhist site.',
    panoramaUrl: 'https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg',
    monasteryId: 'rumtek',
    images: ['/images/rumtek-tour-1.jpg'],
  },
  {
    id: 'tour-pemayangtse',
    name: 'Pemayangtse Monastery Virtual Tour',
    description: 'Discover the ancient beauty of Pemayangtse Monastery in this virtual experience. View the stunning Zangdok Palri sculpture, ancient thangkas, and the breathtaking Kanchenjunga backdrop.',
    panoramaUrl: 'https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg',
    monasteryId: 'pemayangtse',
    images: ['/images/pemayangtse-tour-1.jpg'],
  },
];

const media = [
  // Rumtek media
  { id: 'media-rumtek-1', fileName: 'rumtek-exterior.jpg', filePath: '/images/rumtek-1.jpg', fileType: 'image', description: 'Exterior view of Rumtek Monastery', monasteryId: 'rumtek', festivalId: null },
  { id: 'media-rumtek-2', fileName: 'rumtek-prayer-hall.jpg', filePath: '/images/rumtek-2.jpg', fileType: 'image', description: 'Main prayer hall interior', monasteryId: 'rumtek', festivalId: null },
  { id: 'media-rumtek-3', fileName: 'rumtek-stupa.jpg', filePath: '/images/rumtek-3.jpg', fileType: 'image', description: 'Golden stupa at Rumtek', monasteryId: 'rumtek', festivalId: null },
  // Pemayangtse media
  { id: 'media-pemayangtse-1', fileName: 'pemayangtse-view.jpg', filePath: '/images/pemayangtse-1.jpg', fileType: 'image', description: 'Panoramic view of Pemayangtse Monastery', monasteryId: 'pemayangtse', festivalId: null },
  { id: 'media-pemayangtse-2', fileName: 'pemayangtse-sculpture.jpg', filePath: '/images/pemayangtse-2.jpg', fileType: 'image', description: 'Zangdok Palri sculpture', monasteryId: 'pemayangtse', festivalId: null },
  // Tashiding media
  { id: 'media-tashiding-1', fileName: 'tashiding-stupa.jpg', filePath: '/images/tashiding-1.jpg', fileType: 'image', description: 'Golden stupa at Tashiding', monasteryId: 'tashiding', festivalId: null },
  { id: 'media-tashiding-2', fileName: 'tashiding-entrance.jpg', filePath: '/images/tashiding-2.jpg', fileType: 'image', description: 'Monastery entrance', monasteryId: 'tashiding', festivalId: null },
  // Panoramic media
  { id: 'media-pano-rumtek', fileName: 'rumtek-panorama.jpg', filePath: 'https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg', fileType: 'panoramic', description: '360° panoramic view of Rumtek Monastery', monasteryId: 'rumtek', festivalId: null },
  { id: 'media-pano-pemayangtse', fileName: 'pemayangtse-panorama.jpg', filePath: 'https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg', fileType: 'panoramic', description: '360° panoramic view of Pemayangtse Monastery', monasteryId: 'pemayangtse', festivalId: null },
  // Festival media
  { id: 'media-losar-1', fileName: 'losar-dance.jpg', filePath: '/images/losar-1.jpg', fileType: 'image', description: 'Cham dance during Losar', monasteryId: 'rumtek', festivalId: 'losar-2025' },
  { id: 'media-bumchu-1', fileName: 'bumchu-ceremony.jpg', filePath: '/images/bumchu-1.jpg', fileType: 'video', description: 'Sacred water ceremony', monasteryId: 'tashiding', festivalId: 'bumchu-2025' },
];

function seed() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  db.exec('DELETE FROM media');
  db.exec('DELETE FROM tours');
  db.exec('DELETE FROM festivals');
  db.exec('DELETE FROM monasteries');

  // Insert monasteries
  const insertMonastery = db.prepare(`
    INSERT INTO monasteries (id, name, description, history, architecture, rituals, foundedYear, latitude, longitude, address, images, virtualTourId, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const m of monasteries) {
    insertMonastery.run(
      m.id, m.name, m.description, m.history, m.architecture, m.rituals,
      m.foundedYear, m.latitude, m.longitude, m.address,
      JSON.stringify(m.images), m.virtualTourId || null, now, now
    );
  }
  console.log(`  ✅ Inserted ${monasteries.length} monasteries`);

  // Insert festivals
  const insertFestival = db.prepare(`
    INSERT INTO festivals (id, name, description, date, duration, significance, monasteryId, images, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const f of festivals) {
    insertFestival.run(
      f.id, f.name, f.description, f.date, f.duration, f.significance,
      f.monasteryId, JSON.stringify(f.images), now, now
    );
  }
  console.log(`  ✅ Inserted ${festivals.length} festivals`);

  // Insert tours
  const insertTour = db.prepare(`
    INSERT INTO tours (id, name, description, panoramaUrl, monasteryId, images, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const t of tours) {
    insertTour.run(
      t.id, t.name, t.description, t.panoramaUrl || null,
      t.monasteryId, JSON.stringify(t.images), now, now
    );
  }
  console.log(`  ✅ Inserted ${tours.length} tours`);

  // Insert media
  const insertMedia = db.prepare(`
    INSERT INTO media (id, fileName, filePath, fileType, description, monasteryId, festivalId, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const md of media) {
    insertMedia.run(
      md.id, md.fileName, md.filePath, md.fileType, md.description,
      md.monasteryId || null, md.festivalId || null, now, now
    );
  }
  console.log(`  ✅ Inserted ${media.length} media files`);

  console.log('\n🎉 Database seeded successfully!');
}

seed();
