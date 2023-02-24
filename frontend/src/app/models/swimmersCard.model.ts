export class swimmersCard {
    public name:string;
    public lastname:string;
    public age:string;
    public result:string;
    public competition:string;
    public gender:string;
    public date:string;
    public style:string;
    public distance:string;

    constructor(name:string,lastname:string,age:string,result:string,competition:string,gender:string,date:string,style:string,distance:string) {
        this.name = name;
        this.lastname = lastname;
        this.age = age;
        this.result = result;
        this.competition = competition;
        this.gender = gender;
        this.date = date;
        this.style = style;
        this.distance = distance;
    }
}