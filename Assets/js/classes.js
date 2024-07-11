class Base {
    constructor(id, title, description, thumbnail) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.thumbnail = thumbnail;
    }

    short_description(num) {
        return this.description.slice(0, num);
    }
}

export class Meal extends Base {
    ingredients = [];
    ingrMeasures = [];

    constructor(id, title, category, area, description, thumbnail, tags, youtube, source) {
        super(id, title, description, thumbnail);
        this.category = category;
        this.area = area;
        // this.description = description;  //instructions
        this.tags = tags;
        this.youtube =youtube;
        this.source = source;
    }

    getTags() {
        return this.tags.split(',');
    }

    getValuesFromObj_usingRegex(obj, regexFilter) {
        let arrKeys = [];
        let arrVals = [];

        // get all keys (follow a pattern) and put them in array
        arrKeys = Object.keys(obj).filter((key) => { return regexFilter.test(key)});
        // get all values from obj with matched keys
        for (const [key, value] of Object.entries(obj)) {
            if(arrKeys.includes(key) && value) {
                arrVals.push(value);
            }
        }
        return arrVals;
    }
}

export class MealWithAll {
    constructor(id, title, thumbnail) {
        this.id = id;
        this.title = title;
        this.thumbnail = thumbnail;
    }
}

export class Category extends Base {
    constructor(id, title, description, thumbnail) {
        super(id, title, description, thumbnail);
    }
}

export class Area {
    constructor(title) {
        this.title = title;
    }
}

export class Ingredient {
    constructor(id, title, description, type) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.type = type;
    }
    
    getThumb() {
        return `https://www.themealdb.com/images/ingredients/${this.title}-Small.png`;
    }

    short_description(num) {
        if(this.description) {
            return this.description.slice(0, num);
        } else {
            return "No description available"
        }
    }
}
