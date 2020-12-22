// __tests__/handler.test.js
const GetProject = require('../modules/Project/GetProject');
const Responses = require('../Services/API_Responses');

test('GetProject Test Case', () => {
    expect(GetProject.handler().exist);
    var eventRequest = {
        pathParameters: { name: "node-admin" }
    }

    return GetProject.handler(eventRequest).then(data => {
        expect(data).toBe({});
    });
});