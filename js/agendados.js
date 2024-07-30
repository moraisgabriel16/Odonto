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
        const formattedPhone = formatPhone(appointment.phone);

        const whatsappLink = `https://api.whatsapp.com/send/?phone=55${appointment.phone}&text=Ola+${encodeURIComponent(appointment.name)},+sua+consulta+com+foi+agendada+para+a+${encodeURIComponent(formattedDate)}&type=phone_number&app_absent=0`;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${appointment.name}</td>
            <td><a href="${whatsappLink}" target="_blank">${formattedPhone}</a></td>
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

function formatPhone(phone) {
    if (phone.length === 8) {
        return phone.replace(/(\d{4})(\d{4})/, '$1-$2');
    } else if (phone.length === 9) {
        return phone.replace(/(\d{5})(\d{4})/, '$1-$2');
    } else if (phone.length === 10) {
        return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (phone.length === 11) {
        return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (phone.length === 13) {
        return phone.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, '($1) $2 $3-$4');
    }
    return phone;
}

function filterAppointments() {
    const filter = document.getElementById('filter').value.toLowerCase();
    const rows = document.querySelectorAll('#appointments-table tbody tr');

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const match = Array.from(cells).some(cell => cell.innerText.toLowerCase().includes(filter));
        row.style.display = match ? '' : 'none';
    });
}
