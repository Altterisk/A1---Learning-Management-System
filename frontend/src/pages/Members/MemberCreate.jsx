import MemberForm from '../../components/MemberForm';

const MemberCreate = () => {
  return (
    <div className="container mx-auto p-6">
      <MemberForm
        editingMember={false}
      />
    </div>
  );
};

export default MemberCreate;
