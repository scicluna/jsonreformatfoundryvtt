const fs = require('fs');
const path = require('path');
const tables = require('./input/tables.json')
const uuid = require('uuid')

const convertToDbFormat = (json) => {
    return json.map((table, index) => {
        return {
            name: table.name,
            description: "A table",
            results: table.results.map((result, i) => {
                return {
                    type: 0,
                    text: `"${result}"`,
                    weight: 1,
                    range: [i + 1, i + 1],
                    drawn: false,
                    img: "icons/svg/d20-black.svg",
                    documentCollection: "",
                    documentId: null,
                    _id: uuid.v4(),
                    flags: {},
                };
            }),
            replacement: true,
            displayRoll: true,
            img: "icons/svg/d20-black.svg",
            formula: "1d" + table.results.length,
            flags: {
                core: {
                    sourceId: uuid.v4(),
                },
            },
            _stats: {
                systemId: "dnd5e",
                systemVersion: "2.0.3",
                coreVersion: "10.286",
                createdTime: Date.now(),
                modifiedTime: Date.now(),
                lastModifiedBy: uuid.v4(),
            },
            folder: null,
            sort: 0,
            ownership: {
                default: 0,
                ALJ5mIZ5xzGe2XAs: 3,
            },
            _id: uuid.v4(),
        };
    });
};

function tableSmasher(tables) {
    const smashedTables = []
    for (let i = 0; i < tables.length; i++) {
        let table = tables[i]
        const nextTable = tables[i + 1]
        if (nameEquality(table, nextTable)) {
            table = recursivenameCheck(table, nextTable, tables, i + 1)
        }
        if (!nameEquality(table, tables[i - 1])) {
            table.name = formatTablename(table.name)

            smashedTables.push(table)
        }
    }
    return smashedTables
}

function formatTablename(name) {
    name = name.replace(/1$/, "")
    name = name.replace(/(\d+-)(\d+)/, (match, p1, p2) => {
        return p1 + p2.padStart(3, '0');
    })
    let words = name.split(' ')
    words[2] = words[2].charAt(0).toUpperCase() + words[2].slice(1)

    return words.join(" ")
}

function nameEquality(table1, table2) {
    if (!table1 || !table2) return false

    const name1 = table1.name.split(":")
    const name2 = table2.name.split(":")

    const title1 = name1[1].replace(/\d+$/, '').toLowerCase();
    const title2 = name2[1].replace(/\d+$/, '').toLowerCase();

    if (title1 == title2) {
        return true
    }
    return false
}

function recursivenameCheck(table, nextTable, tables, index) {
    if (!nameEquality(table, nextTable)) return table

    for (let i = 0; i < nextTable.results.length; i++) {
        table.results.push(nextTable.results[i])
    }
    return recursivenameCheck(table, tables[index + 1], tables, index + 1)
}

const writeToFile = (json) => {
    const dbFormat = convertToDbFormat(json);

    const filePath = path.join(__dirname, './output/output.txt');

    dbFormat.forEach((dbLine) => {
        fs.appendFileSync(filePath, JSON.stringify(dbLine) + '\n');
    });
};

writeToFile(tableSmasher(tables));