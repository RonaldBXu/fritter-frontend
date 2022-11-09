<!-- Form for creating freets (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';
import moment from 'moment';

export default {
  name: 'CreateScheduledFreetForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/scheduledfreets',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'content', label: 'Content', value: ''},
        {id: 'publish_date', label: 'Publish Date', value: ''},
      ],
      title: 'Schedule a freet',
      refreshFreets: true,
      callback: () => {
        const message = 'Successfully scheduled a freet!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
