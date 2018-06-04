describe("测试点赞鄙视方法计算", function () {
	it("点赞和鄙视数", function(){
		expect(window.nums('up')).toBe(1);
		expect(window.nums('up')).toBe(2);
		expect(window.nums('down')).toBe(1);
		expect(window.nums('down')).toBe(0);
		expect(window.nums('down')).toBe(1);
	})
})