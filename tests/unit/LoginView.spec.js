import { shallowMount } from '@vue/test-utils';
import LoginView from '@/views/LoginView.vue';
describe('LoginView.vue', () => {
    it('is a Vue instance', () => {
        const wrapper = shallowMount(LoginView);
        expect(wrapper.vm).toBeTruthy();
    });
});
//# sourceMappingURL=LoginView.spec.js.map