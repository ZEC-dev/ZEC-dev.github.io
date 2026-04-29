---
title: TypeScript教程
date: 2026-04-29 21:21:03
tags:
    - ts
    - javascript
    - ByAI
categories:
  - 技术笔记
except :
    TypeScript 全面入门指南
---
# TypeScript 全面入门指南

TypeScript 是微软开发的一个基于 JavaScript 的强类型编程语言，它添加了静态类型检查和其他高级特性，最终编译成纯 JavaScript 运行。

<!-- more -->

## 一、环境搭建与基础配置

### 1.1 安装 TypeScript

安装 TypeScript 有两种主要方式：

```plaintext
// 全局安装（推荐初学者）
npm install -g typescript

// 检查安装是否成功
tsc --version

// 或者在项目中作为开发依赖安装
npm init -y
npm install typescript --save-dev
```

### 1.2 创建第一个 TypeScript 文件

创建一个简单的 TypeScript 文件：

```plaintext
// hello.ts
function greet(name: string): string {
    return `Hello, ${name}!`;
}

const message = greet("TypeScript");
console.log(message);
```

### 1.3 编译 TypeScript

使用 TypeScript 编译器将 `.ts` 文件编译为 `.js` 文件：

```plaintext
// 编译单个文件
tsc hello.ts

// 编译后生成 hello.js
// hello.js
function greet(name) {
    return "Hello, " + name + "!";
}
var message = greet("TypeScript");
console.log(message);

// 自动编译和监听变化
tsc --watch hello.ts
// 或
tsc -w hello.ts
```

### 1.4 配置 tsconfig.json

创建 `tsconfig.json` 配置文件来管理编译选项：

```plaintext
// 生成默认配置文件
tsc --init

// 一个完整的 tsconfig.json 示例
{
    "compilerOptions": {
        "target": "ES2020",                    // 编译目标版本
        "module": "commonjs",                  // 模块系统
        "lib": ["ES2020", "DOM"],             // 包含的库文件
        "outDir": "./dist",                    // 输出目录
        "rootDir": "./src",                    // 源码目录
        "strict": true,                        // 启用所有严格检查
        "esModuleInterop": true,              // 兼容 CommonJS 和 ES 模块
        "skipLibCheck": true,                 // 跳过库文件检查
        "forceConsistentCasingInFileNames": true
    },
    "include": ["src/**/*"],                  // 包含的文件
    "exclude": ["node_modules", "dist"]       // 排除的文件
}
```

## 二、基础类型系统

### 2.1 JavaScript 的基础类型

```plaintext
// 布尔类型
let isDone: boolean = true;

// 数字类型：支持十进制、十六进制、二进制和八进制
let decimal: number = 6;
let hex: number = 0xf00d;
let binary: number = 0b1010;
let octal: number = 0o744;

// 字符串类型
let color: string = "blue";
color = 'red';
let fullName: string = `Bob Bobbington`;
let age: number = 37;
let sentence: string = `Hello, my name is ${fullName}. I'll be ${age + 1} years old next month.`;

// 数组类型：两种表示方式
let list1: number[] = [1, 2, 3];
let list2: Array<number> = [1, 2, 3];  // 泛型语法

// 元组：固定数量和类型的数组
let tuple: [string, number];
tuple = ["hello", 10];  // OK
// tuple = [10, "hello"];  // Error

// 访问元组元素
console.log(tuple[0].substring(1));  // OK
// console.log(tuple[1].substring(1)); // Error: number 没有 substring 方法

// 枚举：给数字值取友好的名字
enum Color {
    Red,
    Green,
    Blue
}
let c: Color = Color.Green;  // 1

// 也可以手动指定值
enum Status {
    Success = 200,
    NotFound = 404,
    ServerError = 500
}

// 任意类型：可以赋予任何值（慎用）
let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false;

// 空值：void 表示没有任何类型
function warnUser(): void {
    console.log("This is my warning message");
}

// null 和 undefined
let u: undefined = undefined;
let n: null = null;

// never 类型：表示永不存在的值
function error(message: string): never {
    throw new Error(message);
}

function infiniteLoop(): never {
    while (true) {}
}
```

### 2.2 类型断言

类型断言告诉编译器"我知道这个值的类型"：

```plaintext
// 类型断言的两种语法
let someValue: any = "this is a string";

// 尖括号语法
let strLength1: number = (<string>someValue).length;

// as 语法（在 JSX 中必须使用）
let strLength2: number = (someValue as string).length;

// 示例：处理来自 API 的数据
interface UserData {
    name: string;
    age: number;
}

function processData(data: any): void {
    // 使用类型断言确保类型安全
    const userData = data as UserData;
    console.log(`User: ${userData.name}, Age: ${userData.age}`);
}
```

### 2.3 类型推断

TypeScript 会自动推断变量的类型：

```plaintext
// 类型推断示例
let x = 3;                  // x 被推断为 number
let y = "hello";            // y 被推断为 string
let z = [1, 2, 3];          // z 被推断为 number[]

// 最佳实践：让 TypeScript 推断简单类型
const isReady = true;       // 推断为 true 字面量类型
const count = 10;           // 推断为 10 字面量类型

// 复杂对象也能正确推断
const user = {
    name: "Alice",
    age: 30,
    isAdmin: false
};
// user 被推断为 { name: string; age: number; isAdmin: boolean; }
```

## 三、函数

### 3.1 函数类型注解

```plaintext
// 完整的函数类型注解
function add(x: number, y: number): number {
    return x + y;
}

// 函数表达式
const multiply = function(x: number, y: number): number {
    return x * y;
};

// 箭头函数
const divide = (x: number, y: number): number => {
    return x / y;
};

// 可选参数（必须放在必需参数后面）
function buildName(firstName: string, lastName?: string): string {
    if (lastName) {
        return `${firstName} ${lastName}`;
    }
    return firstName;
}

// 默认参数
function createUser(name: string, age: number = 18): string {
    return `${name} is ${age} years old`;
}

// 剩余参数
function sum(...numbers: number[]): number {
    return numbers.reduce((total, num) => total + num, 0);
}

// 函数重载
function processInput(input: string): string[];
function processInput(input: number): number;
function processInput(input: string | number): string[] | number {
    if (typeof input === "string") {
        return input.split("");
    } else {
        return input * 2;
    }
}

// 调用重载函数
const result1 = processInput("hello");  // string[]
const result2 = processInput(42);       // number
```

### 3.2 函数类型

```plaintext
// 函数类型定义
type MathOperation = (x: number, y: number) => number;

// 使用函数类型
const add: MathOperation = (a, b) => a + b;
const subtract: MathOperation = (a, b) => a - b;

// 回调函数类型
function fetchData(callback: (data: string) => void): void {
    // 模拟异步操作
    setTimeout(() => {
        callback("Data received");
    }, 1000);
}

// 调用带有回调的函数
fetchData((data) => {
    console.log(data);
});
```

## 四、接口

### 4.1 对象接口

```plaintext
// 基础接口
interface Person {
    name: string;
    age: number;
    email?: string;  // 可选属性
    readonly id: number;  // 只读属性
}

// 使用接口
const alice: Person = {
    name: "Alice",
    age: 30,
    id: 12345
};

// alice.id = 54321;  // Error: 只读属性不能修改

// 函数类型接口
interface SearchFunc {
    (source: string, subString: string): boolean;
}

const mySearch: SearchFunc = function(src, sub) {
    return src.search(sub) > -1;
};

// 可索引接口
interface StringArray {
    [index: number]: string;
}

const myArray: StringArray = ["Bob", "Fred"];
const myStr: string = myArray[0];
```

### 4.2 接口继承

```plaintext
// 接口继承
interface Shape {
    color: string;
}

interface Square extends Shape {
    sideLength: number;
}

const square: Square = {
    color: "red",
    sideLength: 10
};

// 多继承
interface PenStroke {
    penWidth: number;
}

interface Square2 extends Shape, PenStroke {
    sideLength: number;
}

const square2: Square2 = {
    color: "blue",
    sideLength: 5,
    penWidth: 1.0
};

// 类实现接口
interface ClockInterface {
    currentTime: Date;
    setTime(d: Date): void;
}

class Clock implements ClockInterface {
    currentTime: Date = new Date();
    
    setTime(d: Date) {
        this.currentTime = d;
    }
    
    constructor(h: number, m: number) {}
}
```

## 五、类

### 5.1 类的基础

```plaintext
// 类的基本结构
class Animal {
    // 属性
    private name: string;
    protected age: number;  // 可以在子类中访问
    public species: string;
    
    // 静态属性
    static classification: string = "Animalia";
    
    // 构造函数
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
        this.species = "Unknown";
    }
    
    // 方法
    public move(distanceInMeters: number = 0): void {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
    
    // 私有方法
    private sleep(): void {
        console.log(`${this.name} is sleeping`);
    }
    
    // 静态方法
    static getClassification(): string {
        return this.classification;
    }
    
    // Getter 和 Setter
    get animalName(): string {
        return this.name;
    }
    
    set animalName(newName: string) {
        if (newName.length > 0) {
            this.name = newName;
        }
    }
}

// 使用类
const dog = new Animal("Dog", 3);
dog.move(10);
console.log(Animal.getClassification());
dog.animalName = "Buddy";
console.log(dog.animalName);
```

### 5.2 继承

```plaintext
// 继承
class Bird extends Animal {
    private wingSpan: number;
    
    constructor(name: string, age: number, wingSpan: number) {
        super(name, age);  // 调用父类构造函数
        this.species = "Bird";
        this.wingSpan = wingSpan;
    }
    
    // 重写父类方法
    public move(distanceInMeters: number = 0): void {
        console.log(`${this.animalName} flew ${distanceInMeters}m.`);
        super.move(distanceInMeters);  // 调用父类方法
    }
    
    // 新增方法
    public chirp(): void {
        console.log("Chirp chirp!");
    }
}

// 抽象类
abstract class Department {
    constructor(public name: string) {}
    
    printName(): void {
        console.log("Department name: " + this.name);
    }
    
    abstract printMeeting(): void;  // 必须在子类中实现
}

class AccountingDepartment extends Department {
    constructor() {
        super("Accounting and Auditing");
    }
    
    printMeeting(): void {
        console.log("The Accounting Department meets each Monday at 10am.");
    }
    
    generateReports(): void {
        console.log("Generating accounting reports...");
    }
}
```

## 六、泛型

### 6.1 泛型基础

```plaintext
// 泛型函数
function identity<T>(arg: T): T {
    return arg;
}

// 使用泛型函数
let output1 = identity<string>("myString");
let output2 = identity("myString");  // 类型推断

// 泛型数组
function loggingIdentity<T>(arg: T[]): T[] {
    console.log(arg.length);
    return arg;
}

// 泛型约束
interface Lengthwise {
    length: number;
}

function loggingIdentity2<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);
    return arg;
}

// loggingIdentity2(3);  // Error: number 没有 length 属性
loggingIdentity2("hello");  // OK
loggingIdentity2([1, 2, 3]);  // OK

// 泛型接口
interface GenericIdentityFn<T> {
    (arg: T): T;
}

function identity2<T>(arg: T): T {
    return arg;
}

let myIdentity: GenericIdentityFn<number> = identity2;
```

### 6.2 泛型类

```plaintext
// 泛型类
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
    
    constructor(zeroValue: T, add: (x: T, y: T) => T) {
        this.zeroValue = zeroValue;
        this.add = add;
    }
}

let myGenericNumber = new GenericNumber<number>(0, (x, y) => x + y);
let stringNumeric = new GenericNumber<string>("", (x, y) => x + y);

// 使用多个泛型参数
class Pair<K, V> {
    constructor(public key: K, public value: V) {}
    
    getKey(): K {
        return this.key;
    }
    
    getValue(): V {
        return this.value;
    }
}

const pair1 = new Pair<string, number>("age", 30);
const pair2 = new Pair<number, boolean>(1, true);
```

## 七、模块

### 7.1 导出和导入

```plaintext
// math.ts - 导出模块
export const PI = 3.14159;

export function calculateCircumference(diameter: number): number {
    return PI * diameter;
}

export function calculateArea(radius: number): number {
    return PI * radius * radius;
}

// 默认导出
export default class Calculator {
    static add(a: number, b: number): number {
        return a + b;
    }
}

// app.ts - 导入模块
import Calculator, { PI, calculateCircumference } from './math';

// 重命名导入
import { PI as PiValue } from './math';

// 导入所有
import * as MathUtils from './math';

console.log(calculateCircumference(10));
console.log(Calculator.add(5, 3));
console.log(MathUtils.PI);
```

### 7.2 命名空间

```plaintext
// 命名空间
namespace Validation {
    export interface StringValidator {
        isAcceptable(s: string): boolean;
    }
    
    const lettersRegexp = /^[A-Za-z]+$/;
    const numberRegexp = /^[0-9]+$/;
    
    export class LettersOnlyValidator implements StringValidator {
        isAcceptable(s: string) {
            return lettersRegexp.test(s);
        }
    }
    
    export class ZipCodeValidator implements StringValidator {
        isAcceptable(s: string) {
            return s.length === 5 && numberRegexp.test(s);
        }
    }
}

// 使用命名空间
let validators: { [s: string]: Validation.StringValidator; } = {};
validators["ZIP code"] = new Validation.ZipCodeValidator();
validators["Letters only"] = new Validation.LettersOnlyValidator();

// 测试
["Hello", "98052", "101"].forEach(s => {
    for (let name in validators) {
        console.log(`"${s}" - ${validators[name].isAcceptable(s) ? 'matches' : 'does not match'} ${name}`);
    }
});
```

## 八、高级类型

### 8.1 联合类型和交叉类型

```plaintext
// 联合类型
type StringOrNumber = string | number;

function processInput(input: StringOrNumber): string {
    if (typeof input === "string") {
        return input.toUpperCase();
    } else {
        return input.toFixed(2);
    }
}

// 交叉类型
interface Person {
    name: string;
    age: number;
}

interface Employee {
    employeeId: string;
    department: string;
}

type Staff = Person & Employee;

const staff: Staff = {
    name: "Alice",
    age: 30,
    employeeId: "E123",
    department: "Engineering"
};

// 字面量类型
type Direction = "north" | "south" | "east" | "west";
type StatusCode = 200 | 404 | 500;

function move(direction: Direction): void {
    console.log(`Moving ${direction}`);
}
```

### 8.2 类型别名和映射类型

```plaintext
// 类型别名
type Point = {
    x: number;
    y: number;
};

type ID = string | number;

// 映射类型
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};

type Partial<T> = {
    [P in keyof T]?: T[P];
};

interface User {
    id: number;
    name: string;
    email: string;
}

type ReadonlyUser = Readonly<User>;
type PartialUser = Partial<User>;

// 条件类型
type IsString<T> = T extends string ? true : false;
type Result1 = IsString<string>;  // true
type Result2 = IsString<number>;  // false

// 实用工具类型
type UserPreview = Pick<User, "name" | "email">;
type UserWithoutEmail = Omit<User, "email">;
type Nullable<T> = T | null;
type NonNullable<T> = T extends null | undefined ? never : T;
```

### 8.3 类型守卫

```plaintext
// typeof 类型守卫
function padLeft(value: string, padding: string | number): string {
    if (typeof padding === "number") {
        return Array(padding + 1).join(" ") + value;
    }
    return padding + value;
}

// instanceof 类型守卫
class Bird {
    fly() {
        console.log("flying...");
    }
}

class Fish {
    swim() {
        console.log("swimming...");
    }
}

function move(pet: Bird | Fish) {
    if (pet instanceof Bird) {
        pet.fly();
    } else {
        pet.swim();
    }
}

// 自定义类型守卫
interface Cat {
    meow(): void;
}

interface Dog {
    bark(): void;
}

function isDog(animal: Cat | Dog): animal is Dog {
    return (animal as Dog).bark !== undefined;
}

function petAnimal(animal: Cat | Dog): void {
    if (isDog(animal)) {
        animal.bark();
    } else {
        animal.meow();
    }
}

// in 操作符类型守卫
function move2(pet: Bird | Fish) {
    if ("fly" in pet) {
        pet.fly();
    } else {
        pet.swim();
    }
}
```

## 九、实践项目示例

### 9.1 简单的待办事项应用

```plaintext
// types.ts
export interface Todo {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    createdAt: Date;
    completedAt?: Date;
}

export type TodoFilter = 'all' | 'active' | 'completed';

// todoService.ts
export class TodoService {
    private todos: Todo[] = [];
    private nextId: number = 1;
    
    addTodo(title: string, description: string = ''): Todo {
        const todo: Todo = {
            id: this.nextId++,
            title,
            description,
            completed: false,
            createdAt: new Date()
        };
        this.todos.push(todo);
        return todo;
    }
    
    getTodos(filter: TodoFilter = 'all'): Todo[] {
        switch (filter) {
            case 'active':
                return this.todos.filter(todo => !todo.completed);
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            default:
                return [...this.todos];
        }
    }
    
    toggleTodo(id: number): Todo | null {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            todo.completedAt = todo.completed ? new Date() : undefined;
            return todo;
        }
        return null;
    }
    
    deleteTodo(id: number): boolean {
        const index = this.todos.findIndex(t => t.id === id);
        if (index !== -1) {
            this.todos.splice(index, 1);
            return true;
        }
        return false;
    }
}

// app.ts
import { TodoService, TodoFilter } from './todoService';

const todoService = new TodoService();

// 添加待办事项
todoService.addTodo('Learn TypeScript', 'Complete the TypeScript tutorial');
todoService.addTodo('Build a project', 'Create a small project using TypeScript');
todoService.addTodo('Review code');

// 标记完成
todoService.toggleTodo(1);

// 获取不同状态的待办事项
console.log('All todos:', todoService.getTodos());
console.log('Active todos:', todoService.getTodos('active'));
console.log('Completed todos:', todoService.getTodos('completed'));

// 删除待办事项
todoService.deleteTodo(3);
```

## 十、调试和错误处理

### 10.1 常见的 TypeScript 错误

```plaintext
// 1. 类型不匹配错误
let age: number = "25";  // Error: Type 'string' is not assignable to type 'number'

// 2. 访问不存在的属性
interface User {
    name: string;
}

const user: User = { name: "Alice" };
console.log(user.age);  // Error: Property 'age' does not exist on type 'User'

// 3. 未定义的变量
function greet(name: string): void {
    console.log(hello);  // Error: Cannot find name 'hello'
}

// 4. 参数数量错误
function add(a: number, b: number): number {
    return a + b;
}
add(1);  // Error: Expected 2 arguments, but got 1

// 5. 模块导入错误
// import { nonExistent } from './module';  // Error: Module has no exported member 'nonExistent'
```

### 10.2 调试技巧

```plaintext
// 使用 source maps 进行调试
// tsconfig.json 中配置：
{
    "compilerOptions": {
        "sourceMap": true,
        "outDir": "./dist"
    }
}

// 使用 console.log 和类型断言
function processData(data: any): void {
    // 调试时添加类型断言
    const typedData = data as { id: number; name: string };
    console.log('Processing data:', typedData);
    
    // 检查类型
    console.log('Type of data:', typeof data);
    console.log('Is array?', Array.isArray(data));
}

// 使用调试器
function complexCalculation(values: number[]): number {
    debugger;  // 在此处设置断点
    return values.reduce((total, value) => {
        // 可以在此处检查变量
        return total + value * 2;
    }, 0);
}
```

## 十一、最佳实践

### 11.1 代码组织

```plaintext
// 良好的文件结构
project/
├── src/
│   ├── types/          // 类型定义
│   │   ├── user.ts
│   │   └── product.ts
│   ├── services/       // 业务逻辑
│   │   ├── userService.ts
│   │   └── productService.ts
│   ├── utils/          // 工具函数
│   │   └── formatters.ts
│   ├── components/     // UI 组件（如果使用框架）
│   └── index.ts        // 入口文件
├── tests/              // 测试文件
├── dist/               // 编译输出
├── package.json
└── tsconfig.json

// 使用 barrel exports
// types/index.ts
export * from './user';
export * from './product';
export * from './order';

// 使用：import { User, Product } from './types';
```

### 11.2 类型安全的最佳实践

```plaintext
// 1. 避免使用 any
// 不好的做法
function processData(data: any): any {
    return data.something;
}

// 好的做法
interface Data {
    something: string;
}

function processData(data: Data): string {
    return data.something;
}

// 2. 使用接口而不是内联类型
// 不好的做法
function createUser(user: { name: string; age: number }): void {
    // ...
}

// 好的做法
interface User {
    name: string;
    age: number;
}

function createUser(user: User): void {
    // ...
}

// 3. 使用 readonly 保护数据
interface Config {
    readonly apiUrl: string;
    readonly timeout: number;
}

const config: Config = {
    apiUrl: 'https://api.example.com',
    timeout: 5000
};
// config.apiUrl = 'new-url';  // Error: 只读属性

// 4. 使用 const 断言
const colors = ['red', 'green', 'blue'] as const;
// colors[0] = 'yellow';  // Error: 只读数组

// 5. 使用 unknown 而不是 any
function safeParse(json: string): unknown {
    return JSON.parse(json);
}

const result = safeParse('{"name": "Alice"}');
// result.name;  // Error: Object is of type 'unknown'
if (typeof result === 'object' && result !== null && 'name' in result) {
    console.log((result as { name: string }).name);  // 安全访问
}
```

## 十二、与 JavaScript 互操作

### 12.1 声明文件 (.d.ts)

```plaintext
// 为 JavaScript 库添加类型声明
// jquery.d.ts
declare namespace jQuery {
    function ajax(url: string, settings?: any): void;
    function get(url: string, data?: any, success?: any, dataType?: any): void;
    function post(url: string, data?: any, success?: any, dataType?: any): void;
}

// 使用 declare 声明全局变量
declare const VERSION: string;
declare function logMessage(message: string): void;

// 使用三斜线指令引用声明文件
/// <reference path="jquery.d.ts" />

// 在现代项目中，通常使用 @types 包
// npm install @types/jquery --save-dev
```

### 12.2 迁移 JavaScript 项目

```plaintext
// 1. 重命名 .js 文件为 .ts
// 2. 处理初始错误
let someValue;  // 隐式的 any 类型

// 添加类型注解
let someValue: string;

// 3. 逐步添加严格的类型检查
// 从宽松配置开始
{
    "compilerOptions": {
        "strict": false,
        "noImplicitAny": false
    }
}

// 逐步启用严格模式
{
    "compilerOptions": {
        "strict": true,
        "noImplicitAny": true,
        "strictNullChecks": true
    }
}

// 4. 使用 JSDoc 注解
/**
 * @param {string} name - 用户名
 * @returns {string} 问候语
 */
function greet(name) {
    return `Hello, ${name}!`;
}
```

## 十三、学习资源和下一步

### 13.1 官方资源

- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [TypeScript GitHub 仓库](https://github.com/microsoft/TypeScript)

### 13.2 推荐的学习路径

1. **基础掌握**：类型系统、接口、类、泛型
2. **中级进阶**：高级类型、模块、命名空间、装饰器
3. **高级应用**：类型编程、工具类型、编译器 API
4. **框架集成**：React + TypeScript、Vue + TypeScript、Angular

### 13.3 实战项目想法

1. **待办事项应用**：练习基础类型和状态管理
2. **API 客户端**：练习接口定义和异步操作
3. **计算器应用**：练习类设计和错误处理
4. **数据可视化工具**：练习复杂类型和第三方库集成

记住，学习 TypeScript 是一个循序渐进的过程。从简单的类型注解开始，逐步掌握更高级的特性，最终你将能够写出类型安全、易于维护的 JavaScript 代码。