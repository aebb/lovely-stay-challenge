import *  as validate from  '../../../src/utils/validator';
import {InvalidArgumentError} from "commander";

describe('validator', () => {

    it('validate not a number',  () => {
        expect(() => {validate.validate('abc','')}).toThrow('Not a number');
    })

    it('validate < 0',  () => {
        expect(() => {validate.validate('-1','')}).toThrow('Not a positive number');
    })

    it('validate > max',  () => {
        expect(() => {validate.validateWithMax('6','')}).toThrow('Must be lower than 5');
    })
})