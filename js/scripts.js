document.addEventListener('DOMContentLoaded', function() {
    loadAppointments();
});

function loadAppointments() {
    let appointments = JSON.parse(localStorage.getItem('appointments')) || [];

    const tableBody = document.querySelector('#appointments-table tbody');
    tableBody.innerHTML = ''; // Limpa a tabela antes de carregar os dados
    appointments.forEach((appointment, index) => {
        const formattedDate = formatDate(appointment.date);
        const formattedType = capitalizeFirstLetter(appointment.type);
        const formattedPayment = capitalizeFirstLetter(appointment.payment);
        const formattedService = formatService(appointment.service);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${appointment.name}</td>
            <td>${formattedDate}</td>
            <td>${appointment.time}</td>
            <td>${formattedType}</td>
            <td>${formattedService}</td>
            <td>${formattedPayment}</td>
            <td><button class="btn-delete" onclick="deleteAppointment(${index})">Excluir</button></td>
        `;
        tableBody.appendChild(row);
    });
}

function deleteAppointment(index) {
    if (confirm("Tem certeza de que deseja excluir este agendamento?")) {
        let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        appointments.splice(index, 1);
        localStorage.setItem('appointments', JSON.stringify(appointments));
        loadAppointments();
        showFeedback('Agendamento excluído com sucesso!', 'success');
    }
}

function showFeedback(message, type) {
    const feedback = document.getElementById('feedback');
    feedback.className = type;
    feedback.innerText = message;
    feedback.style.display = 'block';
    setTimeout(() => {
        feedback.style.display = 'none';
    }, 5000);
}

function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatService(service) {
    return service.split('-').map(word => capitalizeFirstLetter(word)).join(' ');
}
