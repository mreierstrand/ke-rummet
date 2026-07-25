// Billeder hentes automatisk fra src/assets/images/{Mappe}/ — læg blot flere
// filer i den relevante mappe, så dukker de op her uden kodeændringer.
//
// Mapper der matcher en person i "roster" herunder bliver til personer.
// Alle andre mapper under assets/images/ (fx "Sverige") bliver automatisk
// til album, opkaldt efter mappenavnet.

const imageModules = import.meta.glob(
  '../assets/images/*/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true, import: 'default' },
);

// Group every image path by its immediate parent folder name.
const foldersMap = {};
for (const path of Object.keys(imageModules)) {
  const match = path.match(/\/images\/([^/]+)\//);
  if (!match) continue;
  const folder = match[1];
  if (!foldersMap[folder]) foldersMap[folder] = [];
  foldersMap[folder].push(path);
}

function photosFor(folderName) {
  const paths = foldersMap[folderName] || [];
  return paths.sort().map((path) => imageModules[path]);
}

function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents (æ/ø/å survive via replace below)
    .replace(/[^a-z0-9æøå]+/g, '-')
    .replace(/(^-+|-+$)/g, '');
}

// ---------- Familier ----------
const familyRoster = [
  { id: 'kabell', folder: 'Kabell' },
  { id: 'eierstrand', folder: 'Eierstrand' },
];

export const families = familyRoster.map(({ id, folder }) => {
  const gallery = photosFor(folder);
  return {
    id,
    name: folder,
    photos: gallery.length,
    cover: gallery[0] ?? null,
    gallery,
  };
});

const roster = [
  // Kabell
  {
    id: 'anders',
    folder: 'Anders',
    families: [
      { id: 'kabell', role: 'Far', order: 1 },
      { id: 'hansen', role: 'Far', order: 1 },
    ],
  },
  {
    id: 'marianne',
    folder: 'Marianne',
    families: [{ id: 'kabell', role: 'Mor', order: 2 }],
  },
  {
    id: 'mark',
    folder: 'Mark',
    families: [{ id: 'kabell', role: 'Søn', order: 3 }],
  },
  {
    id: 'maria',
    folder: 'Maria',
    families: [{ id: 'kabell', role: 'Svigerdatter', order: 4 }],
  },
  {
    id: 'theodor',
    folder: 'Theodor',
    families: [{ id: 'kabell', role: 'Barnebarn', order: 5 }],
  },{
    id: 'emma',
    folder: 'Emma',
    families: [{ id: 'kabell', role: 'Barnebarn', order: 6 }],
  },{
    id: 'mille',
    folder: 'Mille',
    families: [{ id: 'kabell', role: 'Barnebarn', order: 7 }],
  },

  {
    id: 'sandra',
    folder: 'Sandra',
    families: [{ id: 'kabell', role: 'Datter', order: 8 }],
  },{
    id: 'jesper',
    folder: 'Jesper Simo',
    families: [{ id: 'kabell', role: 'Svigersøn', order: 9 }],
  },
  {
    id: 'johan',
    folder: 'Johan',
    families: [{ id: 'kabell', role: 'Barnebarn', order: 10}],
  },{
    id: 'filippa',
    folder: 'Filippa',
    families: [{ id: 'kabell', role: 'Barnebarn', order: 11 }],
  },
  {
    id: 'emilie',
    folder: 'Emilie',
    families: [
      { id: 'kabell', role: 'Datter', order: 12 },
      { id: 'eierstrand', role: 'Datter', order: 12 },
    ],
  },
  // {
  //   id: 'eddie',
  //   folder: 'Eddie',
  //   families: [{ id: 'kabell', role: 'Barnebarn', order: 14 }],
  // },
  {
    id: 'sofie',
    folder: 'Sofie',
    families: [{ id: 'kabell', role: 'Datter', order: 15 }],
  },{
    id: 'oliverkoch',
    folder: 'Oliver K',
    families: [{ id: 'kabell', role: 'Svigersøn', order: 16 }],
  },{
    id: 'zoey',
    folder: 'Zoey',
    families: [{ id: 'kabell', role: 'Barnebarn', order: 17 }],
  },{
    id: 'cody',
    folder: 'Cody',
    families: [{ id: 'kabell', role: 'Barnbarn', order: 18 }],
  },
  // {
  //   id: 'baby',
  //   folder: 'Baby',
  //   families: [{ id: 'kabell', role: 'Barnbarn', order: 19 }],
  // },

  // Eierstrand – sæt de order-numre du ønsker
  {
    id: 'jens',
    folder: 'Jens',
    families: [{ id: 'eierstrand', role: 'Far', order: 1 }],
  },
  {
    id: 'karin',
    folder: 'Karin',
    families: [{ id: 'eierstrand', role: 'Mor', order: 2 }],
  },
  {
    id: 'frederikke',
    folder: 'Frederikke',
    families: [{ id: 'eierstrand', role: 'Datter', order: 3 }],
  },
  {
    id: 'jesper',
    folder: 'Jesper',
    families: [{ id: 'eierstrand', role: 'Svigersøn', order: 4 }],
  },
  {
    id: 'simon',
    folder: 'Simon',
    families: [{ id: 'eierstrand', role: 'Barnebarn', order: 5 }],
  },
  {
    id: 'victor',
    folder: 'Victor',
    families: [{ id: 'eierstrand', role: 'Barnebarn', order: 6 }],
  },
  {
    id: 'cecilie',
    folder: 'Cecilie',
    families: [{ id: 'eierstrand', role: 'Datter', order: 7 }],
  },
  {
    id: 'david',
    folder: 'David',
    families: [{ id: 'eierstrand', role: 'Svigersøn', order: 8 }],
  },
  {
    id: 'william',
    folder: 'William',
    families: [{ id: 'eierstrand', role: 'Barnebarn', order: 9 }],
  },
  {
    id: 'hjalte',
    folder: 'Hjalte',
    families: [{ id: 'eierstrand', role: 'Barnebarn', order: 10 }],
  },
  {
    id: 'oliver',
    folder: 'Oliver E',
    families: [{ id: 'eierstrand', role: 'Søn', order: 11 },
      { id: 'kabell', role: 'Svigersøn', order: 13 }
    ],
    
  },
  {
    id: 'eddie',
    folder: 'Eddie',
    families: [{ id: 'eierstrand', role: 'Barnebarn', order: 13 }],
  },
];

export const people = roster.map(({ id, folder, families }) => {
  const gallery = photosFor(folder);
  return {
    id,
    name: folder,
    families, // nu array af { id, role }
    photos: gallery.length,
    cover: gallery[gallery.length -1] ?? null,
    gallery,
  };
});

const peopleFolders = new Set(roster.map((r) => r.folder));

// Mapping: hvilke album der hører til hvilken familie
const albumFamilyMap = {
  'Familien Hansen': {
    families: ['hansen', 'kabell'],
    people: ['anders'],
  },
  'Familien Larsen': {
    families: ['kabell'],
    people: ['marianne'],
  },
  Gruppebilleder: {
    families: ['kabell', 'hansen'],
    people: ['anders', 'marianne', 'mark', 'sandra', 'emilie', 'sofie'],
  },
  Sverige: {
    families: ['kabell', 'hansen'],
    people: ['anders', 'marianne', 'mark', 'sandra', 'emilie', 'sofie'],
  },
};

export const albums = Object.keys(foldersMap)
  .filter((folder) => !peopleFolders.has(folder))
  .sort()
  .map((folder) => {
    const gallery = photosFor(folder);
    const meta = albumFamilyMap[folder] || { families: [], people: [] };

    return {
      id: slugify(folder),
      name: folder,
      families: meta.families || [],
      people: meta.people || [], // ← ny
      count: gallery.length,
      cover: gallery[0] ?? null,
      gallery,
    };
  });
