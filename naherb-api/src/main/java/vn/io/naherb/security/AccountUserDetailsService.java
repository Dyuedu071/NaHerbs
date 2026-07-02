package vn.io.naherb.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import vn.io.naherb.account.Account;
import vn.io.naherb.account.AccountRepository;

@Service
@RequiredArgsConstructor
public class AccountUserDetailsService implements UserDetailsService {

    private final AccountRepository accountRepository;

    @Override
    public UserDetails loadUserByUsername(String login) {
        Account account = accountRepository.findByEmailOrPhone(login)
                .orElseThrow(() -> new UsernameNotFoundException("Email hoặc mật khẩu không đúng"));

        return User.withUsername(account.getEmail())
                .password(account.getPassword())
                .authorities("ROLE_" + account.getRole().name())
                .disabled(!account.isEnabled())
                .build();
    }
}
